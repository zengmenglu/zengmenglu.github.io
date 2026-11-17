
# 数据

## rune

* byte == int8，用于处理ascii字符
* rune == int32，用于处理unicode或utf-8字符

中文字符在utf-8下占3字节。

https://juejin.im/post/5b44caebf265da0f491b8b83

## slice 

### 格式
go语言编译器会自动在以标识符、数字字面量、字母字面量、字符串字面量、特定的关键字（break、continue、fallthrough和return）、增减操作符（++和--）、或者一个右括号、右方括号和右大括号（即)、]、}）结束的非空行的末尾自动加上分号。
因此slice 正确的赋值如下：

```
a1 := []int{
     1,2,3,
}
a2 := []int{
     1,2,3}
```

如下赋值方法是错误的

```
//错误的赋值方法
a3 := []int{
     1,2,3
}
```

### 二维数组的排序
可以重新实现sort接口实现，需要实现Len, Less, Swap这三个方法,之后调用sort.Sort函数即可。具体如下。

```
// 实现接口
type Arrays [][]int
func(e Arrays)Len()int{
	return len(e)
}
func(e Arrays)Swap(i,j int){
	e[i],e[j]=e[j],e[i]
}
func(e Arrays)Less(i,j int)bool{
	return e[i][0]<e[j][0]
}

// 函数调用
func sort(data [][]int) {
	sort.Sort(Arrays(data))
}

```


## go map
### 声明与初始化
1. 声明

 ```
var null_map map[string]int
```
  此时，map变量仅被声明了，未被初始化。未初始化的map值为nil，当map未被初始化就被设置元素值时会引起panic。

2. 初始化


 ```
 map1 := make(map[string]int,5) //初始化容量为5的map
 map2 := make(map[string]int)

 map3 := map[string]int{}
 map4 := map[string]int{1,2,3,4,5}
 ```
 map在初始化时，是否指定初始容量差别不大。当map容量不够时会自动扩容。
 
### 遍历


 ```
 for k,v := range map1{
	  //...
 }
 
 for k := range map2{
     //...
 }
 ```
 go map的遍历是随机、无序的。
  

### 增删改查
 
  ```
  map1 := make(map[string]int)
  map1["a"] = 1 //增加元素
  map1["a"] = 0 //修改元素
  delete(map1,"a") //删除元素
 
  if val, ok := map1[key]; ok{ //查找元素
  	//...key元素存在...
  }
  ```
1. map的删除使用内置函数delete，该函数没有返回值。当删除的元素不存在时，delete不会做任何操作。
2. 查找操作时，返回两个值，分别是索引key对应的val，与本次索引是否成功。
3. 比较两个map是否相等，需要遍历比较它们的键值对是否完全相等。

>
> 参考文献
> 
> https://blog.csdn.net/xiangxianghehe/article/details/78790744


## interface 与 reflect
reflect 性能

1. interface{}是可以指向任意对象的Any类型。
2. 一个类只需要实现了接口要求的所有函数，我们就说这个类实现了该接口
3. 实现类的时候，只需要关心自己应该提供哪些方法，不用再纠结接口需要拆得多细才合理
4.  <font color =red><del>类实现接口时，需要导入接口所在的包</del></font>
5. 接口由使用方按自身需求来定义，使用方无需关心是否有其他模块定义过类似的接口

### 方法
1. go中没有类，可以通过为结构体类型定义方法实现类的功能。
2. 只能为在同一包内定义的类型声明方法，<font color=red>不能为在其他包内定义的类型以及内建类型（如int）等声明方法</font>。
3. 方法接收者类型为指针接收者的优点（对比值类型接收者）：
   1. 方法能够修改接收者指向的值；
   2. 避免每次在调用方法时复制该值，若值的类型为大型结构体时，将接收者类型设置为指针类型会更高效。S

