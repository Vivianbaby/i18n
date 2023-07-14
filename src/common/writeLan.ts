// 生成多语言配置文件(json)
import { Config } from "../type";
import {  readJSONSync,  writeJSONSync } from "fs-extra";
import { join } from "path";
import { readChinese } from "../utils/file";



 const writeLan = (chineseMap:Map<string, string>, config: Config, rootPath: string, currPath: string) => {
    const { languages, translatedPath } = config
    const existChineseJson = readChinese(currPath)
    const chineseJson: Record<string, string> = {}
    const otherLanguageJson: Record<string, string> = {}
    for (const [key, value] of chineseMap.entries()) {
         const newKey = typeof key === 'string' ? key.replace(/\s+/g, "") : key
        chineseJson[value] = newKey
        otherLanguageJson[value] = ''
    }
    languages.forEach((lan: string) => {
        if (lan.toLocaleLowerCase().includes('zh')) {
            if (Object.keys(chineseJson).length > 0) {
                writeJSONSync(join(rootPath, translatedPath, `${lan}.json`), { ...existChineseJson, ...chineseJson}, { spaces: 2 })
            }
        } else {
           const existOtherLangue = readJSONSync(join(rootPath, translatedPath, `${lan}.json`), { throws: false})??{}
           for(const key in existChineseJson) {
                if(!existOtherLangue[key] && !otherLanguageJson[key]) {
                     otherLanguageJson[key] = ''
                }
           }
           if (Object.keys(otherLanguageJson).length > 0) {
               writeJSONSync(join(rootPath, translatedPath, `${lan}.json`), {...existOtherLangue, ...otherLanguageJson}, { spaces: 2 })
           }
        }
    })
}

export default writeLan