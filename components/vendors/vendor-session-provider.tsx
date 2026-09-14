"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getCurrentVendor,
  getVendorLandingPath,
  hasVendorPermission,
  isVendorPathAllowed,
  parseVendorSession,
  type VendorPermission,
  type VendorRole,
  type VendorSession,
} from "@/lib/auth";

type VendorSessionContextValue = {
  role: VendorRole | null;
  permissions: VendorPermission[];
  isOwner: boolean;
  session: VendorSession | null;
  isLoading: boolean;
  hasPermission: (key: VendorPermission) => boolean;
};

const VendorSessionContext = createContext<VendorSessionContextValue | null>(
  null,
);

export function VendorSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const existing = useContext(VendorSessionContext);
  if (existing) {
    return <>{children}</>;
  }

  return <VendorSessionProviderInner>{children}</VendorSessionProviderInner>;
}

function VendorSessionProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<VendorSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await getCurrentVendor();
      if (cancelled) return;

      if (result.success && result.data) {
        setSession(parseVendorSession(result.data));
      } else {
        setSession(null);
      }
      setIsLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasPermission = useCallback(
    (key: VendorPermission) => hasVendorPermission(session?.permissions, key),
    [session],
  );

  const value = useMemo<VendorSessionContextValue>(
    () => ({
      role: session?.role ?? null,
      permissions: session?.permissions ?? [],
      isOwner: session?.role === "owner" || session?.type === "owner",
      session,
      isLoading,
      hasPermission,
    }),
    [hasPermission, isLoading, session],
  );

  return (
    <VendorSessionContext.Provider value={value}>
      {children}
    </VendorSessionContext.Provider>
  );
}

export function useVendorSession(): VendorSessionContextValue {
  const context = useContext(VendorSessionContext);
  if (!context) {
    throw new Error(
      "useVendorSession must be used within a VendorSessionProvider",
    );
  }
  return context;
}

export function VendorRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, session } = useVendorSession();

  const allowed = isVendorPathAllowed(pathname, session);

  useEffect(() => {
    if (isLoading || !session || allowed) return;
    const landing = getVendorLandingPath(session.role);
    if (pathname !== landing) {
      router.replace(landing);
    }
  }, [allowed, isLoading, pathname, router, session]);

  if (isLoading) {
    return null;
  }

  if (session && !allowed) {
    return null;
  }

  return <>{children}</>;
}
