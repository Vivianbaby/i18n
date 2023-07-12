import { lstatSync, accessSync, readJSONSync } from 'fs-extra'
import { sep, join } from 'path'
import { PACKAGE_JSON, LV18N_CONFIG } from '../constants/file'
import { Config } from '../type'


export const isFileExisted = (filaName: string) => {
    try {
        accessSync(filaName)
        return true
    } catch (error) {
        return false
    }
}

export const findRootPath = (path: string): string => {
    if (path === '') {
        return ''
    }
    const stat = lstatSync(path)
    const parentPath = path.split(sep).filter(item => item !== '').slice(0, -1).join(sep)
    if (stat.isDirectory()) {
        if (isFileExisted(join(path, PACKAGE_JSON))) {
            return path
        }
        else {
            return findRootPath(parentPath)
        }
    } else {
        return findRootPath(parentPath)
    }
}

// 读取配置文件
export const readConfig = (path: string): Config | null => { 
    const rootPath = findRootPath(path)
    const configPath = join(rootPath, LV18N_CONFIG)
    if (rootPath !== '' && isFileExisted(configPath)) {
        return readJSONSync(configPath) || {}
    } else {
        return null
    }
}

// 读取中文翻译文件
export const readChinese = (path: string): any => {
    const config = readConfig(path)
    if(config) {
        const { languages, translatedPath } = config
        const zhFileName = languages.find(item => item.toLocaleLowerCase().includes('zh'))
        const rootPath = findRootPath(path)
        if(rootPath !== '' && zhFileName) {
            const chinesePath = join(rootPath, translatedPath, `${zhFileName}.json`)
            if(isFileExisted(chinesePath)) {
                return readJSONSync(chinesePath, { throws: false }) ?? {}
            } else {
                return {}
            }
        }
    }
}

// 依赖反转
export const reverseDependence = (dependence: Record<string, string>) => {
    const reverseDependence: Record<string, string> = {}
    for(const [key, value] of Object.entries(dependence)) {
        reverseDependence[value] = key  
    }
    return reverseDependence
}