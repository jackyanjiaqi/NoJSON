##伴随描述
?total=0,
?v=15,
?time = 1,
@total=(@total+@v*@time,@time+=@total)

@time=100,@time++

@time=(?temp,@temp = [@isOk=="jack"]({}):())
@total=(@total*@total,@total=1,@total+=1)

```
@total = @total*@total,
@total = 1,
@total += 1
```
@define = "name"
?selfadd = @ret = @arg + "1"
?name = "have no name"
@name = @name@selfadd

@forTimes(4,@name=@name@selfadd)
```
name1111
@it(4,@name=(@name,@name@selfadd))

?name="value",@name=("jack"+@name,?nick=(@name,@name@add),@print@nick),@print@name
```
输出
```

?name="value",@name="jack"+@name,@name="bob"

@name = "jack",@name="bob"

##逗号和逻辑运算符
[条件A,条件B,条件C]
[条件A&条件B&条件C]
[条件A|条件B|条件C]
条件A执行 返回，条件B执行 返回，条件C执行 中括号外返回条件A的返回结果
条件A执行 返回若为真，条件B执行返回若为真，条件C执行 中括号外返回条件C的执行结果
条件A执行 返回若为假，条件B执行返回若为假，条件C执行 中括号外返回条件C的执行结果

