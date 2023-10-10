import fs from 'fs';
import { join } from 'path';
// @ts-ignore
import translate from '@vitalets/google-translate-api';


export default class TranslateMain {

  translateTypes = [{ type: 'en', fileName: 'en-US' }, { type: 'ja', fileName: 'ja-JP' }];
  suffix = 'ts';
  path = './src/locales/';
  from = { type: 'zh-CN', fileName: 'zh-CN' };
  /** 用来区别每行文本的字符，这里使用换行符*/
  symbol = '\n';
  /** 需要翻译的文本 */
  translateString: any = [];
  /** 翻译完成的回调*/
  translateCallback= (type: string, fileName: string | string | undefined)=>{

  }

  constructor(config: any) {
    if (config.translateTypes) {
      this.translateTypes = config.translateTypes;
    }
    if (config.suffix) {
      this.suffix = config.suffix;
    }
    if (config.path) {
      this.path =join(config.cwd, config.path) ;
    }
    if (config.from) {
      this.from = config.from;
    }



    /** 获中文所有文件信息*/
    for (let i of this.getAllFile()) {
      let text = this.getTranslateString(i.file);

      /** 将每个需要翻译的文件的信息都整理集中*/
      this.translateString.push({
        ...i,
        text: text,
        textArr: text.split('\n'),
      });
    }

  }

  async run() {
    for (let t of this.translateTypes) {
      for (let i of this.translateString) {
        if (i.text && i.text !== '') {
          await translate(i.text, { from: this.from.type, to: t.type }).then((data: any) => {
            let textArrNew = data.text.split('\n');
            let fileTemp = i.fileOrg;
            /** 根据返回的字符进行数组的拆分*/
            for (let s of i.textArr.keys()) {
              if (i.textArr[s]) {
                // i.textArr[s] = i.textArr[s].replace(/'/g,"")
                textArrNew[s] = '\'' + textArrNew[s].replace(/'/g, '') + '\'';
                fileTemp = fileTemp.replace(i.textArr[s], textArrNew[s]);
              }
            }
            this.translateCallback(t.type,i.fileName)
            fs.writeFile(i.isRoot ? this.path + '/' + t.fileName + '.' + this.suffix : this.path + '/' + t.fileName + '/' + i.fileName, fileTemp, { encoding: 'utf8' }, err => {
            });
          }).catch((e)=>{
            console.log(`${i.fileName}翻译错误`)
          });
        }
      }
    }
  }

  /** 获取所有的翻译文件*/
  getAllFile() {
    let pathName = this.path + '/' + this.from.type;

    let fileMap: any = [{
      position: this.path,
      file: pathName + '.' + this.suffix,
      isRoot: true,
      fileName: this.from.type + '.' + this.suffix,
      /** 读取并保存原始的文件 */
      fileOrg: fs.readFileSync(pathName + '.' + this.suffix, 'utf-8'),
    }];

    // this.file = this.file.split('export default')[1];
    // this.file = (new Function('return ' + this.file))();

    function finder(path: any) {
      let files = fs.readdirSync(path);
      files.forEach((val, index) => {

        let fPath = join(path, val);

        let stats = fs.statSync(fPath);

        if (stats.isDirectory()) finder(fPath);

        if (stats.isFile()) fileMap.push({
          position: pathName,
          file: fPath,
          isRoot: false,
          fileName: val,
          /** 读取并保存原始的文件 */
          fileOrg: fs.readFileSync(fPath, 'utf-8'),
        });
      });
    }

    finder(pathName);
    return fileMap;
  }

  /** 根据单个文件读取需要翻译的文本 */
  getTranslateString(files: any) {
    let file = fs.readFileSync(files, 'utf-8');
    let fileArr = file.split(this.symbol);
    let strArr = '';
    for (let i of fileArr) {
      if (i.indexOf(':') != -1 && i.indexOf(',') != -1) {
        strArr += i.substring(i.indexOf(':') + 1, i.indexOf(',')) + '\n';
      }
    }
    return strArr;
  }


}

