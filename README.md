# NoJSON
## Traditional JSON object Use Case
JSON is a **key-valued** structured object in javascript.It's easy to use as below:

```
var a = JSON.parse('{
		"name":"Jack",
		"age":17,
		"hobby":[
			"gamedesign",
			"code",
			"art",
			"music"
		]}');
```

However,using a huge JSON is too complicated,especially you're not the person who design the __keybased structure __ before you hardcode __``.name``__ or __``.hobby[0]``__ into your programs.We all know that __Hardcoding__ is not good,so we'd better use no key for a reasonable object,taking the structure outof keys infomation as a draft,temporarily nameing as _JSRA_ which stands for 'JSON object Structured Route Annotation'.Before this I want to show a simple case.

**An example below shows what happens when the structure become complex.**

I have a few friend whoes names,ages and hobbys are different.

```
var my_friends = JSON.parse('[
		{"name":"Jack","age":17,..},
		{"name":"Debby","age":16,"hobby":..},
		{"name":"Bob","age"..}..
]');
```
I want to visit myself then I must first search the Array,then select a index.``		var me = my_friends.fiter(obj=>obj.name=="Jack")[0]		``so I change the structure.

```
var my_friends = JSON.parse('{
		"Jack":{"age":17,"hobby":[..]},
		"Debby":{"age":16,"hobby":[..]},
		"Bob":{"age":0}..
}');
```

Looks better,Now I can easily select myself from 'Jack' key-word``	my_friends.Jack		``,but what's wrong with "Bob" he seems have no interest telling us his age and hobbys.Indeed,he's older than us,morever he has no cool hobbys either,it'a secret,but my program is like this 

```
my_friends.forEach(friend=>{
	whoIsOldest(friend.age).
	showUsFrom(friend.hobby)
	})
```
So I add a key "isSecret" ``"Bob":{"isSecret":true}`` and my program changes too which looks longer.

```
my_friends.filter(player=>!player.isSecret).forEach(friend=>{
	whoIsOldest(friend.age).
	showUsFrom(friend.hobby)
	})
```
OK,Bob,you win! A few friends don't have fun.Then I give this suggestion to My teacher which is really a shit idea.She arrange us into groups,morever,when groups canot make it easier to recognize we give each group a name,then we give each group a role.This huge JSON grows up step by step.

I make the rule,but the rule is base on keys,and a stand structure is not that easy.Programmers always code for the diversity of demmands.The structure changes,Program changes.At last,I find my program become like this:

```
var shower = my_school.
	grades[4].
	classes[5].
	groups["Lakers"].
		filter(player=> ! player.isSecret).
		filter(player=>player.hobby.some(hobby=>return 			hobby.indexOf("basket")!=-1)).
		filter(basketBallLiker=>whoIsOldest(basketBallLiker.age));
		
BasketBallShow(shower);
```
## NoJSON: Not Only JSON Object
 
1.use __``@``__ +string to give a value a description.

 * __``@s``__ stands for string type
 * __``@n``__ stands for number type 
 * __``@o``__ stands for a object which can have childen
 
2.use __``=@``__ define a new type.for example:

```
{.* match [/((http|ftp|https)://)([a-zA-Z0-9_-]+\.)*/]}=@url
```
Above defines a new description as url for whos key matches the commonly used url RegExp.

`.`is a getValue mode,behind is the key name,which is `*` here specially indicates any key.

`match` is a key word in NoJSON means a relationship from 1 to N.

`[statement]`means a range for a statement calculating results,if put behind a `.` means get a ranged key

```
{.[* match /((http|ftp|https)://)([a-zA-Z0-9_-]+\.)*/]}=@url-key
```
then you can use __``@url``__ to describe a value like _{"enter":"http://baidu.com"}_,use __``@url-key``__ to describe a value like _{"http://baidu.com":"Not Allowed"}_

3.use __``.``__ to enter a find key mode,once met a `@` symbol or a *whitespace* then return the value.

like ``.age`` and with describe annotation a complete key route is ``.age@n`` or ``.name@s`` while _{"age":"28"}_ and _{"name":15}_ doesn't match.When it's an array you can use ``.grades_1@o`` or  ``.grades[1]@o``.

## Tick off the Key(the only way to route a value)

After we fetch a http response,first and most important thing is to anylyse its structure.Then use structure feature to differ each value while the traditional JSON using the unique key to find a value.

**why make this so complicate? Release the key,we can do many things.**

1. We can put script string into keys making the static json active.
2. We can minimum the json string by using nonsense letters like 'a','b'.
3. Initial process of Data Model Designing depends on no technology and its implementations.the description is pure from a bussiness fair.  you can change it any time any place.
4. Better than any combinations of different tech frames.Simple and On the run.

## Our Final Goal

Define a new mode based on MVC,using NoJSON combines model and controller and pack them into metas.then the View model only handles with **MCMC**(Meta Combinations of Model and Controller),simplify client codes and server codes,quick spread like virus through QR codes,http urls and other medias which can load text string easily.
Like virus,pieces with datas and actions stays in our mobile devices,runing in a certain compiling host app.Soial spread and p2p.