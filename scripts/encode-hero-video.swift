// Re-encodes the homepage hero video into the small web versions in /public/home.
// macOS only (uses Apple's AVFoundation encoder). H.264, no audio, fast-start, 30 fps.
//
//   swiftc -O scripts/encode-hero-video.swift -o /tmp/encode-hero
//   # desktop: centre 16:9 band of the 1080x1920 source
//   /tmp/encode-hero public/herovid.mp4 public/home/hero-desktop.mp4 0 656 1080 608 1080 608 850000 30
//   # mobile: full portrait frame at 720p
//   /tmp/encode-hero public/herovid.mp4 public/home/hero-mobile.mp4 0 0 1080 1920 720 1280 750000 30
//
// Posters (hero-*-poster.webp) are the first frame of each output.
//
// usage: encode <src> <out.mp4> <cropX> <cropY> <cropW> <cropH> <outW> <outH> <bitrate> <fps>
import AVFoundation

let a = CommandLine.arguments
let src = URL(fileURLWithPath: a[1])
let out = URL(fileURLWithPath: a[2])
let crop = CGRect(x: Double(a[3])!, y: Double(a[4])!, width: Double(a[5])!, height: Double(a[6])!)
let outSize = CGSize(width: Double(a[7])!, height: Double(a[8])!)
let bitrate = Int(a[9])!
let fps = Int32(a[10])!
try? FileManager.default.removeItem(at: out)

let sema = DispatchSemaphore(value: 0)
Task {
  do {
    let asset = AVURLAsset(url: src)
    let track = try await asset.loadTracks(withMediaType: .video)[0]
    let duration = try await asset.load(.duration)
    let pt = try await track.load(.preferredTransform)

    // Crop then scale: move the crop origin to 0,0 and scale it to the output size.
    let s = outSize.width / crop.width
    let t = pt
      .concatenating(CGAffineTransform(translationX: -crop.minX, y: -crop.minY))
      .concatenating(CGAffineTransform(scaleX: s, y: s))
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    layer.setTransform(t, at: .zero)
    let instr = AVMutableVideoCompositionInstruction()
    instr.timeRange = CMTimeRange(start: .zero, duration: duration)
    instr.layerInstructions = [layer]
    let comp = AVMutableVideoComposition()
    comp.renderSize = outSize
    comp.frameDuration = CMTime(value: 1, timescale: fps)
    comp.instructions = [instr]

    let reader = try AVAssetReader(asset: asset)
    let rOut = AVAssetReaderVideoCompositionOutput(
      videoTracks: [track],
      videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    rOut.videoComposition = comp
    reader.add(rOut)

    let writer = try AVAssetWriter(outputURL: out, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true // moov atom up front: playback starts before download ends
    let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: Int(outSize.width),
      AVVideoHeightKey: Int(outSize.height),
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2,
        AVVideoExpectedSourceFrameRateKey: Int(fps),
        AVVideoAllowFrameReorderingKey: false,
      ],
    ])
    wIn.expectsMediaDataInRealTime = false
    writer.add(wIn)

    guard reader.startReading() else {
      print("READER FAILED", reader.error ?? "unknown")
      sema.signal()
      return
    }
    guard writer.startWriting() else {
      print("WRITER FAILED", writer.error ?? "unknown")
      sema.signal()
      return
    }
    // The compositor emits a couple of black warm-up frames; skip them and start the timeline at
    // the first real frame so the loop never flashes black.
    func isBlack(_ sb: CMSampleBuffer) -> Bool {
      guard let px = CMSampleBufferGetImageBuffer(sb) else { return true }
      CVPixelBufferLockBaseAddress(px, .readOnly)
      defer { CVPixelBufferUnlockBaseAddress(px, .readOnly) }
      let base = CVPixelBufferGetBaseAddress(px)!.assumingMemoryBound(to: UInt8.self)
      let bpr = CVPixelBufferGetBytesPerRow(px), w = CVPixelBufferGetWidth(px), h = CVPixelBufferGetHeight(px)
      var sum = 0, n = 0
      for y in stride(from: 0, to: h, by: 16) {
        for x in stride(from: 0, to: w, by: 16) {
          let p = base + y * bpr + x * 4
          sum += Int(p[0]) + Int(p[1]) + Int(p[2]); n += 3
        }
      }
      return sum / max(n, 1) < 3
    }
    var firstOpt = rOut.copyNextSampleBuffer()
    var skipped = 0
    while let f = firstOpt, isBlack(f), skipped < 30 {
      skipped += 1
      firstOpt = rOut.copyNextSampleBuffer()
    }
    guard let first = firstOpt else {
      print("NO FRAMES")
      sema.signal()
      return
    }
    print("skipped black frames:", skipped)
    let firstPTS = CMSampleBufferGetPresentationTimeStamp(first)
    print("first frame at", firstPTS.seconds)
    writer.startSession(atSourceTime: firstPTS)
    var pending: CMSampleBuffer? = first
    let q = DispatchQueue(label: "enc")
    wIn.requestMediaDataWhenReady(on: q) {
      // Referencing the reader here keeps it alive for as long as the writer is pulling frames.
      guard reader.status == .reading else {
        print("READER STOPPED", reader.error ?? "unknown")
        wIn.markAsFinished()
        writer.cancelWriting()
        sema.signal()
        return
      }
      while wIn.isReadyForMoreMediaData {
        if let buf = pending ?? rOut.copyNextSampleBuffer() {
          pending = nil
          wIn.append(buf)
        } else {
          wIn.markAsFinished()
          writer.finishWriting {
            if writer.status == .failed { print("FAILED", writer.error ?? "") }
            sema.signal()
          }
          return
        }
      }
    }
  } catch {
    print("ERROR", error)
    sema.signal()
  }
}
sema.wait()
let size = (try? FileManager.default.attributesOfItem(atPath: out.path)[.size] as? Int) ?? 0
print(out.lastPathComponent, String(format: "%.2f MB", Double(size) / 1_048_576))
