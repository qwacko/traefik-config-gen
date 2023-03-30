import Docker from 'dockerode'
import { error } from '@sveltejs/kit'

const printContainerInfo = async () => {
  const docker = new Docker()
  const dockerInfo = await docker.listContainers()
}

export const GET = async ({ url }) => {
  await printContainerInfo()

  const min = Number(url.searchParams.get('min') ?? '0')
  const max = Number(url.searchParams.get('max') ?? '1')

  const d = max - min

  if (isNaN(d) || d < 0) {
    throw error(
      400,
      'min and max must be numbers, and min must be less than max'
    )
  }

  const random = min + Math.random() * d

  return new Response(String(random))
}
