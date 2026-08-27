import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

export function AccountMenu() {
  const navigate = useNavigate();
  const router = useRouter();
  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      const { error } = await signOut();

      if (error) {
        throw new Error("No fue posible cerrar sesión. Inténtalo nuevamente.");
      }
    },
    onSuccess: async () => {
      await navigate({ to: "/", replace: true });
      await router.invalidate();
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Abrir menú de cuenta"
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#294944] text-white transition hover:bg-[#3d655d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294944]"
        >
          <UserRound size={19} aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={logoutMutation.isPending}
            onClick={() => {
              if (!logoutMutation.isPending) {
                logoutMutation.mutate();
              }
            }}
          >
            <LogOut aria-hidden="true" />
            {logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {logoutMutation.isError ? (
        <p role="alert" className="sr-only">
          {logoutMutation.error.message}
        </p>
      ) : null}
    </>
  );
}
