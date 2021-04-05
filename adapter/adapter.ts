import type { Adapter } from '@sveltejs/kit'
import * as path from 'path'
import * as fs from 'fs'
//@ts-ignore
import ParcelBundler from "parcel-bundler";
import { spawn } from 'child_process';

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

        const bundler = new ParcelBundler(
            [path.join(__dirname, 'lambda', 'index.js')],
            {
                outDir: path.join(contentPath, 'server-bundle'),
                bundleNodeModules: true,
                target: 'node',
                sourceMaps: false,
                minify: false,
            },
        )
        await bundler.bundle()

        const proc = spawn('npx', [
            'cdk',
            'deploy',
            'AdapterStack',
            '--require-approval', 'never',
        ], {
            cwd: __dirname,
            env: Object.assign({
                SERVER_PATH: path.join(contentPath, 'server-bundle'),
                STATIC_PATH: path.join(contentPath, 'static'),
            }, process.env),
        })
        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
    }
}

