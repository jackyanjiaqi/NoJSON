#一、术语
首先了解一下nojson文档中出现的术语。
##1.1 主语
一个nojson语句执行的默认结构型输入。最外层的主语类似于javascript中的global全局对象

 * .表示在当前主语下操作，默认省略
 * ..表示在上一级主语上操作

##1.2 管道遍历
nojson的每一个型都有可能改变很多内容，一次管道遍历包含从左至右的访问和从右至左的回溯
###顺序输入、输出
 * 从左至右访问时候的输入：从左边的上一级语句返回的@arg中获得的参数，在当前语句中由@arg访问
 * 从左至右访问时候的输出：将结果写入到当前语句的@arg中，并传递给右边下一级的@arg
 
###逆序输入、输出
 * 从右至左回溯时候的输入：从右边的下一级语句返回的@ret中获得的参数，在当前语句中由@ret访问
 * 从右至左回溯时候的输出：将结果写入到当前语句的@ret中，并传递给左边上一级的@ret
 
##1.3 路由器
一次管道遍历后能够使得主语发生变化的型
##1.4 过滤器
存在逆序输入输出的型

##1.5 字面量
由json结构支持的具有原始类型的非变量，运行时不会改变。
其他语言中用const修饰的右值，枚举值，只可以引用不可以修改。
nojson在字符串解析时即产生的型，是其他型以及语法树生成的基础。




#二、内定义型

##2.1 @prop @value 和 @key 

@prop 表示一个键值对 .value取值 .key取键
@value 和 @key 分别表示__取值__和__取键__，没有定义，对应于实现语言的原生功能 例如javascript原生方法``[]``或``.``；对应于java Map类型__push(key,value)__ 和 __get(key)__

在Nojson中一个核心的概念就是通过模糊定义的型代替路由来进行查找，而非具体到某个语言的某个特性函数或操作，即便其具体实现很有可能就是一个底层函数，但是通过与特地语言解耦，使得Nojson更加关注业务，其script风格也更能够直接描述业务成为一份名副其实的业务说明文档，

##2.2 @num @str @obj @bool

* @num 值为number类型 原生语言的类型判断功能 例如javascript typeof str == 'number';java 的 obj instanceof Integer || instanceof 
Double || instanceof Float
* @str 值为string类型 原生语言的类型判断功能 例如javascript typeof str == "string";java 的 obj instanceof String
* @obj 值为object类型 原生语言的类型判断功能 除了@num @str的非null和undefined值;java 中非null的 Map
* @bool 值为boolean类型

##2.3 @reg (known as @str)
值为@str型且满足正则表达式，只用作定义其他型 例：?color = @reg = “^#[A-Z]{3}” 定义一种新的型color 其值形为#RED #BLA
##2.4 @arg @ret
* @arg 负责当前语句管道遍历的顺序输入输出 引用@arg 写入@arg=
* @ret 负责当前语句管道遍历的逆序输入输出 引用@ret 写入@ret=

##2.5 @single (known as @obj)
表示只有一个键值对的对象类型 
例：

```
{
	"number_test@wrong":123,				//不是single型 因为不是对象 是number
	"color_test@single":{"red":"#RED"}		//是single型 因为对象只有一个键值对
}
```
##2.6 @pure (@single included)
@pure 表示所有值同属于一种类型
例：

```
{
	"_1":"#RED",
	"_2":"#BLA",
	"_3":"#DGR"
}
```
@single型值肯定为@pure型
##2.7 @it及其衍生型
表示迭代。 @it<T>(item@T,id@num|str),collection)
@it_double(_1,_2)
@it_trible(_1,_2,_3)
@it_some(@func(_1))
@it_every(@func(_1))
@it_someDouble(@func(_1,_2))
@it_everyDouble(@func(_1,_2))
@it_someTrible(@func(_1,_2,_3))
@it_everyTrible(@func(_1,_2,_3))
##2.8 @list @set 
__``?list=@obj@it(kv@prop[.key == @num])``__
它定义了如下一个类型检查器

javascript代码实现如下:

```
//检查是否是list型值
Nojson.testIsListType(test_data){
	//检查是否是object型值
	if(Nojson.testIsOjectType(test_data)){
		//每个key都是number类型的
		return Object.keys(test_data).every(key=>Nojson.testIsNumberType(key));
	}
	return false;
}
```
__``?set=@obj[!@list]``__
它定义了如下一个类型检查器

```
Nojson.testIsSetType(test_data){
	return !Nojson.testIsListType(test_data);
}
```
##9变量与id

	除了由``@``开头和由``.``开头的以字母或下划线为首的单词为变量
	定义一个变量用``var``关键字 这同其他语言相同
	由纯数字开头的变量为id值，将代表唯一一个实例，主要参与游戏中的筛选，抽取，排序等等。

#二、支持的运算符

* ``=`` 赋值运算符
* ``> >= == != <= <``比较运算
* ``& | !``逻辑运算符 与或非

#三、命名约定
@后面的为型名
名词性型名常作为过滤器和查询器(路由器)
动宾结构型名常作为处理器
状语结构的型名常作为条件器

a_b_c表示a,b,c具有层级关系,
可以用于表示键 或 型
.a_b_c表示该键下还有b这个键,b键下还有c这个键
@a_b_c则表示a型下包含b型，b型内包含c型，合起来就是一个包涵了c型的b型的a型。
默认以下滑线开头的表示系统临时创建的变量
在@符号前满足下划线+数字的表示字面变量，例如_1@arg,表示将@arg寄存在临时变量中等待备用,其后直接使用_1表示其引用,如下例子

```
?total = @n = 0
@names@it(_1@arg,@arg@it(_2@arg,@total+= _2@*_1@weight + _2@offset)
```

@中文=@name 默认中文型名只做文本替代 必须有英文的型名作为字面量

#四、内定义关键字
##1.at符号@
在原生语言中跟在变量后面起到说明和注解的作用
比如``var me@psswrd = "1234567"``;
如上是我的密码的意思。

在Nojson中叫做型,作为查询(路由)器、过滤器和执行器

1.其中方向为顺序的作为查询器和路由器(往往同时作用),用于在当前结构型主语上查询并为后向型产生新的结构型主语。
注：在一个类@a@b@c的结构中为了让后向型仅作为查询器而不作为路由器，常用@a_b_c约定写法来保留a的主语地位
注：可以@@连用用来占位，表示级别向下，与后文提到的..级别向上相对应，同时@*n与..*n相对应

什么是结构型？
	结构型分为内建型和自定义型
	内建型详见(一)内定义型。
	自定义型根据定义的查询规则，主要有Nojson支持的条件和查询、过滤等语法以及与内建型复合使用的结构型。

	Nojson("me@psswrd")表示从Nojson中查询具有psswrd型的变量赋值给me
	Nojson("ask(answer@func,['开始游戏'])"),对传入的answer类型过滤，是一个函数而不是一个string或普通对象，若传入其他类型会报错。
	var me@boy = {
		"name":"JEY"
		"girlfriend":
	}
	
##2.点号.

>在多个编程语言中表示属性访问和方法调用，在nojson也保留此定义，表示对点号后面的字面量进行属性访问或方法调用

例如:

```
//表示给当前主语赋值name属性="Jack"
.name = "Jack"
//调用当前主语的指定方法start
.start()
```
 *  `.`号作为路由器表示当前级，避免向下路由，默认省略
 *  `..`号表示向上一级
 * `...`在中间表示省略，在折叠表达式中表示折叠
##3.星号*
常与其他关键字连用表示确数
* `..*4`表示向上4级
* `.*4`表示宽度为4 常用于自定义结构型和查询
* `@*4`表示深度为4 常用于自定义结构型和查询

##4.中括号[]
条件查询，跟在对象后面表示对此对象的一个查询匹配，内部可以使用复杂的表达式，只有为真时才会继续向右执行(隐含的表达式概念是从左向右执行的)

	me@psswrd 实际上就是me[@reg="/\d{5,16}/"]
	因为psswrd定义如下：
	?psswrd=@reg="/\d{5,16}/"
	
##5.小括号()
* 小括号内为同一级,括号内用逗号隔开的语句使用同一主语
* 括号内优先运算，跟在型后面表示描述(跟在@func型后面默认表示函数输入的实参表比如@print({name:"Jack"}))

跟在]后面表示满足条件后执行的内容 //[](执行的内容)相当于if(){执行的内容}  []:()
跟在等号=、星号*等元操作符后称作伴随描述，用于打破元操作，在期间添加执行内容从而影响结果。
其功能类似于操作符重载，可见在nojson中的元操作符还有更加底层的操作符号。详见NoJSON高阶技巧.md
##6.冒号:
表示分支
[condition1:condition2:condition3:condition4]state1:state2:state3:state4:default_state
相当于
[condition1]state1:
[condition2]state2:
[condition3]state3:
[condition4]state4:
default_state
冒号实际上表示语句块之间是一种互斥关系。
##7.逗号,
表示程序流程的顺序执行,每一个逗号分隔的语句块之间是并列关系先执行的语句块不会阻塞后执行语句块。(若不使用,则有可能顺序执行的语句受到前一次执行的影响例如@a@b@c或@a[语句b]@c,@c有可能不执行)
##8.大括号{}
##9.下划线_
详见命名
##10.ask
用户输入,从一个集合选择其中一个,由用户决定选择哪个,选择后立即执行回调
```
ask(answer@callback_s,questions@set@noblank);
answer(reply,selectId@s){
}
```
或者

```
ask(onSelect@callback_n,selected@list@noblank);
answer(reply,selectId@n){
}
```

##11.select 
用户输入,从一个集合中选择一个子集合,由用户决定选择哪些个,每选择一个则触发一次状态改变函数
以javascript为例：
```
select(onSelect@callback,selected@set@noblank);
onSelect(selectItems@set,selectId@str,state@bool){
}
```
或者

```
select(onSelect@callback_n,selected@list@noblank);
onSelect(selectItems@list,selectId@num,state@bool){
}
```
##12.emit
emit(),向Nojson内部发出消息,由于存在多人交互和服务器和客户端间通信,有流程参加的例如使用了ask select 或者条件表达式[]以及选择条件表达式?[]:的表达式在结尾处添加结果。以便通知后续的活动。客户端未及时添加服务端默认为超时并继续轮训下一个动作。

#五、一个服务端启动游戏的实例

##服务器端脚本index.js


```
//原始json数据 构造一个具有一个@txt型值、一个@img@html的型值和一个@func型值的json数据类型，该类型定义为buttonlike
Nojson("?buttonlike=@txt & @img@html & @func")
var game = {
	...
	"_1@single@buttonlike"{
		"_1@buttonlike":{
			"_1@txt":"txt://start",
			"_2@img@html":"img://http://img.baidu.com/img/34234201.png",
			"_3@func":"func://state/init"
		}
	}
}
//构造model结构
Nojson(game)
//查找节点
(“starter@buttonlike@single”)
//设置点击交互
("ask(answer@callback<@buttonlike,@num>,[starter])")
//点击游戏开始
("answer(@buttonlike,@num){
	starter@func();//取出func并执行func函数
}");
```

##Nojson模块内部实现
```
..
this.state.init();//state是游戏设计师预先定义好的状态 包含一系列的预定义和执行函数
..
```

1. model模型全部封装在Nojson内部
2. 网络通过ajax或socket等方式传输nojson格式的json数据
3. nojson数据在服务端被打碎压缩并重组发送到客户端由客户端解释修改并添加到客户端json模型当中
4. nojson封装了行为和数据，通过自定义的格式和相应的正则表达式在解析json时添加型的概念并构造路由型表，内部通过查找型表方式路由对象和数据，数据作为远端的镜像不可以被修改以确保服务端和客户端概念统一。
5. 型只能在服务端创建并完成编辑。
6. nojson不提供视图模型，但提供基本的交互方案。

#六、交互策略

##1.客户端交互

	作为内定义关键字的select可以设置一些列限制如时间限制等并在时间到达时触发默认操作，这在多人在线卡牌游戏当中尤为重要。

##2.通信交互

	不论使用socket连接，还是ajax方案，必须保证服务端的变化能够及时同步到客户端，客户端的变化必须反映到服务端，可以使用轮询模型
	
#七、定义卡牌行为

	以上所有的基础都是为了定义一个简单易于表达和修改的卡牌声明行为，例如：三国杀中出一张杀，引起的一系列行为。
	在出一张杀前，首先牌局将控制权转交到玩家A面前，玩家B、C、D轮询（或监听）等待，玩家A的客户端扫描手牌区里的牌根据每张牌的触发条件判断能否被点中，若有能出的牌则ask()埋下交互点。
	对于能出多张卡牌的比如扑克，使用select()并填写触发回调。
	对于需要选择场上角色、卡牌的地方需要在回调中继续埋点。
	此时所有判断均基于客户端数据。
	卡牌的大多数行为在一次玩家打出该牌开始，根据先前状态判断执行一系列的卡牌运算流程，该流程封装在该牌的技能描述中(card@description)
	以下是杀和闪两张基本牌的牌面描述和对应于被杀掉血和被出闪不掉血两种情况的运行时环境打印。

//因为与闪息息相关,所以先定义是否有闪@avoid

```
?avoid = @template@cards@it(item@card[.@id == 'shan'])
```
/====================================================================================

//如果没有定义@kill则定义@kill 注：@sos是濒死求桃
	
```
?kill = @func<targetPlayer@user>{targetPlayer@blood-=1[<=0]emit(@sos)}
```
//上面定义的kill函数是原子操作杀两滴血需要@kill*2

/====================================================================================

//@arg表示从外部输入的参数 查询从外部传入的作为目标的user型变量赋值给targetUser

```	
targetUser@arg@user
```
//var targetUser = Nojson.query(this,".@arg@user")

/====================================================================================

	
//询问目标玩家是否出闪，出闪则结束并发出结束信号否则执行扣血操作

```
?[@judge@askFor(@avoid,targetUser)]emit(@used):@kill(targetUser)
```
#八、五十K扑克游戏实例

```
/**
**   此为预定义卡牌模版用到的型 {user,stack,asker}=global
**/
//以下为state.init();的内部log输出
init state: players = {playerA,playerB,playerC,playerD}=@it(item@user)
init state: ?color=@single@value[@reg=”#d{6}”]//定义color型值 符合值以#开头后接6个数字且只有一个键值对的值对象
test out:
{
“_outer@color”:{“_inner@?”:”#123123”}
}
外层对象的键所对应的值为color型值，其key作为标记

init state:?color=@value[@reg=”#[a-zA-Z]{3}”] //定义color型值符合值以#开头后接3个字母的值对象
{
“_outer@?”:{“_inner@color”:”#red”}
}


内层对象所对应的值为
init state: card_stack
Init state: card_stack@cards
Init state: card_stack@cards@prototype?.colors&.names&.numbers
Init state: card_stack@cards@prototype.colors={RED=@color[.value==”#rd”],BLA=@color[.value==”#blck”]}//定义颜色 #rd代表红色#blck代表黑色,颜色集合只有红黑两种颜色
Init state: card_stack@cards@prototype.names={SPADE=@name[?.value==”#spd” & ],DIAMOND=@color[.value==”#dmd”]
init state: stack = {spadeA,spade2,..diamond Q,diamondK}=@stack[num=52]
init state: asker.drawFromRandomUser();

prepare state:

[(A@drawACardFrom(stack),B@drawACardFrom(stack),C@drawACardFrom(stack),D@drawACardFrom(stack)) until [stack@num <= 16]]

//debug打印抽牌后每个人的手牌

debug:print A:
playerA@regions_hand= [1171@heart3,1175@diamond3,1179@heart4,1183@heartQ,
					1187@diamondK,1191@spadeK,1195@club2,1199@diamond2,1203@spade2}

debug:print B:
playerB@regions_hand= [1172@spade5,1176@diamond6,1180@club6,1184@heart6,
					1188@spade8,1192@diamond8,1196@club10,1200@clubQ,1204@heart2}

debug:print C:
playerC@regions_hand=[1173@club4,1177@diamond7,1181@club7,1185@diamond10,
					1189@spadeJ,1193@diamondJ,1197@heartJ,1201@clubA,1205,heartA}

debug:print D:
playerD@regions_hand=[1174@club3,1178@spade4,1182@club5,1186@heart7,1190@club8,1194@diamond9,1198@heart10,1202@clubJ,1206@spadeQ}

//打印stack型下的card型
debug:print @stack@card:
{
“type”:”limit”,
	“_1”:”@createFromTemplate=(0,1){}”,//@func型
“data”:””
}
//打印stack型
{
	@card
}
```
自定义规则器:
扑克牌和一般的卡牌的区别在于不执行单个牌的牌面描述，因为扑克牌本身没有描述，而且扑克牌很简单，只有花色和数字两个属性，因此每次打出的牌会有一个全局的规则，用于判断是否能够打出。我们命名为规则器。
/**
*以下是打出牌的规则:
* 1.可以打出单张 
* 2.可以打出两张一样的
* 3.可以打出三张一样的，同时选择[非必须]最多两张牌作为附带的
* 4.可以打出四张一样的
* 5.可以打出至少三张数字连续的牌
**/
//定义cardNum为卡牌数量
//定义cardMark为卡牌标记
//内定义@arg换名
//定义
@define=@cardNum,@cardMark,@arg,@length
//定义数字相等判断函数

@打出的牌 = @arg;
@数量 = @length;

@是单张 = @isSingle = 
[@arg@length == 1](@ret=(@?cardMark=@arg@n,@?cardNum=@arg@length))

@数字相等 = @numberEquals = 
[@arg@obj@it_everyDouble[@arg_1@n==@arg_2@n]](@ret=(@?cardMark=@arg_1@n,@?cardNum=@arg@length))

//说明(从左至右)：step1:@arg step2:@it_everyDouble
//step1接收返回值bool<-@arg->提供arg型结构作为this
//@it_everyDouble型的输入是一个双输入返回bool的函数型用
//[@arg_1@n==@arg_2@n]表示函数体,
//@arg_1,@arg_2表示step1

@数字连续 = @numberContinues = 
[@arg@obj@it_everyDouble[@arg_1@n + 1 == @arg_2@n]](@ret=(@?cardMark=@arg_2@n,@?cardNum=@arg@length))

@存在三张数字相等 = @haveThreeEquals = 
[@arg@it_someTrible[@arg@numberEquals]]

@满足基本规则 = @ruler_base = 
[@打出的牌(
	@是单张(@ret=(@weight = @ret@cardMark,@starter = 100)) |
	(@数字相等&@数量==2)(@ret=(@weight = @ret@cardMark,@starter = 100)) |
	(@数字相等&@数量==4)(@ret=(@weight = 400*@ret@cardMark,@starter = 100)) |
	(@存在三张数字相等&@数量<=5)(@ret=(@weight = @ret@cardMark,@starter = 100)) |
	(@数量>=3 & @数字连续)(@ret=(@weight=@ret@cardMark,@offset = 100))
]

```
var Nojson = import("./Nojson");
/**
* 需要this
* 总是返回bool型
**/
function it_everyDouble(arg,ret){
	var arg_it_everyDouble = arg;
	var ret_it_everyDouble = ret;
	var res = false;
	if(arg_it_everyDouble){
		var last;
		for(var p in arg_it_everyDouble)	{
			var item = arg_it_everyDouble[p];
			if(last){
				//内建型@construct会把函数调用返回和参数转换成Nojson需要的格式
				res = _condition_1({_1:last,_2:item},null);
								res = Nojson(@ret,"@inject@ret&@construct@arg")
				(_condition_1,last,item);
				if()
			}
			last = self[p];
		}
	}else{
		throw new Error('it_everyDouble needs a input @obj');
	}
	
	//gen by Nosjon
	funtion _condition_1(arg,ret){
		var arg__condition_1 = arg;
		var arg_1_n = Nojson(arg__condition_1['_1'],"@n");
		var arg_2_n = Nojson(arg__condition_1['_2'],"@n");
		if(arg_1_n == arg_2_n){
			ret_it_everyDouble.cardMark = arg_2_n;
			ret_it_everyDouble.cardNum = Nojson(arg_it_everyDouble,'@length');
			return true;
		}else{
			return false;
		}
	}
	return res;
}


function numberEquals(arg){
	
}
function ruler_base(arg){
	this.arg = arg;
	if(this.arg.number = 1){
		//单张 返回一个
		return {}
	}
}
```

规则器的定义如下

