import type { Adapter } from '@sveltejs/kit'

export const adapter: Adapter = {
    name: 'MAGIC',
    async adapt(utils): Promise<void> {
        console.log('TODO...')
    }
}

