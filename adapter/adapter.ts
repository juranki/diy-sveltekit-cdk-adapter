import type { Adapter } from '@sveltejs/kit'
import * as path from 'path'
import * as fs from 'fs'

const rmRecursive = (p:string) => {
    if (!fs.existsSync(p)) return
    const stats = fs.statSync(p)
    if (stats.isDirectory()) {
        fs.readdirSync(p).forEach(f => {
            rmRecursive(path.join(p, f))
        })
        fs.rmdirSync(p)
    } else {
        fs.unlinkSync(p)
    }
}

export const adapter: Adapter = {
    name: 'MAGIC',
    async adapt(utils): Promise<void> {
        const contentPath = path.join(__dirname, 'content')
        rmRecursive(contentPath)
        const serverPath = path.join(contentPath, 'server')
        const staticPath = path.join(contentPath, 'static')
        utils.copy_server_files(serverPath)
        utils.copy_client_files(staticPath)
        utils.copy_static_files(staticPath)
    }
}

