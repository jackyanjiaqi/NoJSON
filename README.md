# NoJSON
##Traditional JSON object Use Case
**JSON is a key-valued structured object in javascript.It's easy to use as below:**

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

However,using a huge JSON is too complicated,especially you're not the __key-namer__ before you hardcode ``	.name	`` or ``	.hobby[0]	`` into your programs.We all know that __Hardcoding__ is not good,so we'd better use no key for a reasonable object,taking the structure outof keys infomation as a draft,temporarily nameing as _JSRA_ which stands for 'JSON object Structured Route Annotation'.Before this I want to show a simple case.

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
OK,Bob,you win! A few friends do'nt have fun.Then I give this suggestion to My teacher which is really a shit idea.She arrange us into groups,morever,when groups canot make it easier to recognize we give each group a name,then we give each group a role.This huge JSON grows up step by step.

I make the rule,but the rule is base on keys,and a stand structure is not that easy.Programmers always code for the diversity of demmands.The structure changes,Program changes.At last,I find my program become like this:

```
var shower = my_school.grades[4].classes[5].groups["Lakers"].
filter(player=> ! player.isSecret).
filter(player=>player.hobby.some(hobby=>return hobby.indexOf("basket")!=-1)).
filter(basketBallLiker=>whoIsOldest(basketBallLiker.age));
BasketBallShow(shower);
```
##Not Only JSON Object
 
1.use ``@`` to describe a value type.
>``@s`` stands for string type
>``@n`` stands for number type
>``@o`` stands for a object which can have childen
2.use ``.`` to name the key,like ``.age`` and with describe annotation a complete key route is ``.age@n`` or ``.name@s``,the key should not be the same with real key,when it's a array you can use ``.grades_1@o``or ``