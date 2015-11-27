/**
*
*  属性描述＝(.属性1类型[属性描述&.属性2类型[(.STR[me.ARR[()))
*  可用的描述
*  深度deep
*
*/
export default class DesGenerator {
	constructor(obj){
		this._me = obj;
		this.father = null;
		/** 针对于原始对象_me的属性集合 **/
		this.__properties = null;


		this.description = '';
		this.isRaw = true;

		/** 当前节点深度 **/
		this.currentLevel = 0;
		/** 当前节点所拥有的最大深度 **/
		this.__level_max = 0;

		this.__select_ids = null;
	}

	filter(name){

	}

	getValue(key){

	}

	regDescription(key,desc){
		if(!this.__select_ids)
			this.__select_ids = {};
		this.__select_ids[key] = desc;
		return this;
	}

	regDescriptions(descs){
		if(!this.__select_ids)
			this.__select_ids = {};
		if(!descs){
			for(var props in descs){
				this.__select_ids[props] = descs;
			}
		}
		return this;
	}

	getDeepest(){
		return this.__level_max;
	}

	getLevel(){
		return this.currentLevel;
	}

	getRoute(){

	}

	getValue(){

	}

	get(){

	}
}

export function parseProps(obj){
	var ret = new DesGenerator(obj);
	var desList = [];
	for(var props in obj){
		//遍历属性
		if(typeof obj[props] === 'string'){
			desList.push({level_max:1,out:'.'+props+'@s'});

		}else
		if(typeof obj[props] === 'number'){
			desList.push({level_max:1,out:'.'+props+'@n'});
		}else
		if(typeof obj[props] === 'object'){
			let parsedConfig;
			if(obj[props] instanceof Array){
				parsedConfig = parseList(ret,props);
				parsedConfig.father = ret;
				// parsedConfig.__level_max += 1;
				desList.push({level_max:parsedConfig.getDeepest(),out:parsedConfig.description});
			}else{
				parsedConfig = parseProps(obj[props]);
				parsedConfig.father = ret;
				parsedConfig.currentLevel = parsedConfig.father.currentLevel + 1;
				parsedConfig.__level_max += 1;
				desList.push({level_max:parsedConfig.getDeepest(),out:'.'+props+'@o'+parsedConfig.description});
			}
		}
	}
	//深度排序
	desList.sort((item1,item2)=>item2.level_max-item1.level_max);
	//计算最大深度
	ret.__level_max = desList.length?desList[0].level_max:0;
	ret.__desc__ = desList;
	//格式化输出
	ret.description = desList.map(item=>item.out).join('\n');
	return ret;
}

function parseList(fatherConfg,motherName){
	var list = fatherConfg._me[motherName];
	var ret = new DesGenerator(list);
	var desList = [];
	//别名
	for(let props=0;props<list.length;props++){
		//增加别名描述
		let alias = motherName + '_' + props;
		// fatherConfg._me[alias] = list[props];
		fatherConfg.regDescription(alias,'.'+motherName+'['+props+']');
		//遍历属性
		if(typeof list[props] === 'string'){
			desList.push({level_max:1,out:'.'+alias+'@s'});
			(x1@s&x2@n&x4[list])
			x2@
			@n
			@url
		}else
		if(typeof list[props] === 'number'){
			desList.push({level_max:1,out:'.'+alias+'@n'});
		}else
		if(typeof list[props] === 'object'){
			//默认不允许有array
			let	parsedConfig = parseProps(list[props]);
			parsedConfig.father = fatherConfg;
			desList.push({level_max:parsedConfig.getDeepest(),out:'.'+alias+'@o'+parsedConfig.description});
		}
	}
	desList.sort((item1,item2)=>item2.level_max-item1.level_max);
	ret.__level_max = desList.length?desList[0].level_max:0;
	ret.description = desList.map(item=>item.out).join('\n');
	return ret;
}