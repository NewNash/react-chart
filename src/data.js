export const data = {
    platform: [
        {
            "category_id": 1,
            "category_listsort": 1,
            "category_status": 1,
            "category_name": "\u3010LH\u9879\u76ee\u3011",
            "category_parent": 0,
            "category_description": "\u6b64\u4e3aLH\u9879\u76ee\u63d0\u4ea4\u6545\u969c\u5206\u7c7b"
        },
        {
            "category_id": 2,
            "category_listsort": 2,
            "category_status": 1,
            "category_name": "\u3010JF\u9879\u76ee\u3011",
            "category_parent": 0,
            "category_description": "JF\u9879\u76ee\u5de5\u5355\u5206\u7c7b"
        },
        {
            "category_id": 4,
            "category_listsort": 7,
            "category_status": 0,
            "category_name": "[\u5176\u4ed6\u9879\u76ee-\u8bf7\u52ff\u5728\u6b64\u9879\u76ee\u4e0b\u63d0\u5355]",
            "category_parent": 0,
            "category_description": "\u5982:\u90ae\u4ef6\u7cfb\u7edf\u3001\u805a\u5408\u652f\u4ed8\uff08\u652f\u4ed8\u901a\u9053\u7ba1\u7406+\u5bf9\u8d26\u7cfb\u7edf\uff09\u3001\u5546\u57ce\u3001\u5fae\u4ea4\u6613\u3001\u76f4\u64ad\u95f4\uff0ccms\u7cfb\u7edf\uff0c\u98ce\u63a7\u7cfb\u7edf\uff0ccrm\u7cfb\u7edf\u3001\u672c\u7cfb\u7edf\u95ee\u9898\u53ca\u672a\u660e\u786e\u7c7b\u522b\u7684\u9879\u76ee\uff0c\u5747\u53ef\u5728\u6b64\u63d0\u5355"
        },
        {
            "category_id": 5,
            "category_listsort": 3,
            "category_status": 1,
            "category_name": "\u3010PM\u9879\u76ee\u3011",
            "category_parent": 0,
            "category_description": "PM\u9879\u76ee"
        },
        {
            "category_id": 8,
            "category_listsort": 0,
            "category_status": 1,
            "category_name": "\u3010PM\u5fae\u6295\u3011",
            "category_parent": 0,
            "category_description": "\u7528\u4e8e\u63d0\u4ea4PM\u5fae\u6295\u76f8\u5173\u4e1a\u52a1\u6545\u969c"
        }]
}


export const chartData ={"platform":"all","date":{"1":"2,1,0,0,0,0,0,0,0,0","2":"1,0,0,0,0,0,0,0,0,0","4":"0,0,0,0,0,0,0,0,0,0","5":"0,0,0,0,0,0,0,0,0,0","8":"0,0,0,0,0,0,0,0,0,0"},"cate_name":"\u3010LH\u9879\u76ee\u3011,\u3010JF\u9879\u76ee\u3011,[\u5176\u4ed6\u9879\u76ee-\u8bf7\u52ff\u5728\u6b64\u9879\u76ee\u4e0b\u63d0\u5355],\u3010PM\u9879\u76ee\u3011,\u3010PM\u5fae\u6295\u3011","day_str":"'20\/04\/01','20\/04\/02','20\/04\/03','20\/04\/04','20\/04\/05','20\/04\/06','20\/04\/07','20\/04\/08','20\/04\/09','20\/04\/10'"}

export function handleData(rowdata){
    let result = []
    let cate_name = rowdata.cate_name.split(',')
    let data = []
    for(let d in rowdata.date){
        let a = rowdata.date[d].split(',')
        data.push(a)
    }
    rowdata.day_str.split(',').forEach((item,index)=>{
        let obj = {}
        obj['name']=item.replace(/\'/g,'')
        for(let i in cate_name ){
            obj[cate_name[i]] = data[i][index]
        }
        result.push(obj)
    })
    return {result,cate_name}
}

