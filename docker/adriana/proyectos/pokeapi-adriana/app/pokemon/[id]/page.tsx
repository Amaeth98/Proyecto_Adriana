import { redirect } from "next/navigation";

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(`/modal?id=${id}`);
  {/* Esta ruta redirige al modal con el id del Pokémon,
    ya que el detalle pokemon no se muestra aqui, si no en modal,
    por eso se redirige a /modal pasando el id como query param,
    provocando asi que se abra la ventana modal con el detalle del pokemon. */}
}