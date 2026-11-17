
# import
       
   1. go通过packet定义包的名称，同一路径下文件的包名必须统一, 建议包名和路径名一致。   
   2. go通过import包所在的路径获取包内容，建议填写绝对路径。
   3. import时写路径名，引用时写包名。
  

## import操作

   1. 点操作
   
      例如`import ."fmt"`，那么在使用打印函数时，不需要`fmt.Println("hello")`, 可以省略写成`Println("hello")`。
   
   2. 别名操作
   
      例如 `import f "fmt"`，将fmt包设置一个别名`f`，则在使用打印函数时，可以写成`f.Println("hello")`.
   
   3. 下划线操作
   
      目的是为了调用包中的init函数，而不使用包中的其他方法。例如
      
       ```
       import _"github.com/xxx"
       ```
       
 
## modules

https://juejin.im/post/5c8e503a6fb9a070d878184a 

https://github.com/golang/go/wiki/Modules

> 参考文献:   

* https://www.cnblogs.com/qiang-cnblog/p/7819587.html


# main
1. main函数所在包必须为main包
2. 一个包内最多只能有一个main方法。（这是显然的，因为在包作用域内，变量或函数名称都应当是唯一的。）
3. main函数不能带参数，没有返回值。
4. main函数可以通过调用flag包解析命令行参数。


# switch
1. 条件表达式可以为空，则默认为true
2. 单个case中，可以出现多个匹配项，例如 `case 1,2,3:`
3. 每个case结束，不需要用break退出一个case。可以使用falltrough关键字，执行紧跟着的下一个case。

# go buildin method
## make
1. 用于<font color=red>slice, map, channel</font>, 分配内存并初始化，返回类型的引用（不是指针）。
2. 使用细则

 Call | Type T | Result
-----|--------|-------
make(T,n) | slice | 创建len，cap 均为 n 的 slice
make(T,n,m) | slice | 创建 len 为 n, cap 为 m 的slice
make(T) | map | 创建map
make(T,n) | map | 创建含有n个初值的map
make（T）| channel | 无缓存的channel
make（T,n） | channel | 缓存大小为 n 的 channel

3. 举例

```
slice1 := make([]int, 5)
map1 := make(map[string]int,5)
fmt.Println(slice1). //[0 0 0 0 0]
```
## 4.2. new
1. 返回类型的指针。
2. 举例

```
pslice1 := new([]int)
fmt.Println(pslice) //&[0 0]
```

## 4.3. len 
1. 适用于array，slice, map, string, channel。
2. 举例

```
fmt.Println(len(slice1))
```
## cap

1. 适用于 array，slice，channel

## 4.4. append
1. 适用于<font color=red>slice</font>。append超过slice的容量时，slice会自动扩容。
2. 用法

```
slice = append(slice, elem1, elem2, ...)
slice = append(slice, anotherSlice)
```

3. 举例

```
slice1 = append(slice1,1)
slice1 = append(slice1,slice2)
```

## 4.5. delete
1. 适用于<font color=red>map</font>，按指定键删除map对应的元素,当元素不存在时，不进行操作。
2. 用法

```
delete(map,key)
```

3. 举例
```
delete(map1,"Mike")
```

> 参考文档：
> 
> * https://blog.csdn.net/uudou/article/details/52241534

# print

## 格式化

[go fmt详细说明LINK](https://golang.org/pkg/fmt/)

* %U unicode字符输出，格式同 "U+%04X"



# go defer
## 功能
将函数推迟到外层函数返回后执行。

注意：推迟调用的函数其参数会立即求值，但直到外层函数返回前该函数都不会被调用。推迟的函数调用会被压入一个栈中。当外层函数返回时，被推迟的函数会按照后进先出的顺序调用。

例：

```
func testf(a *int){
	defer fmt.Println("testf1:",*a)
	*a=100
	fmt.Println("testf2:",*a)
}

func main(){
	a:=10
	defer fmt.Println("1:",a)
	testf(&a)
	fmt.Println("2:",a)
}

```
输出结果：
```
testf2:100
testf1:10
2:100
1:10
```

## 使用陷阱





# go panic
1. 错误是业务过程的一部分，而异常不是。

# go vet
## 功能
go vet 是go tool套件的一部分，用于代码静态检查,在代码编译与运行阶段发现bug，废弃代码等。

## 使用方法
 ``` 
 go tool vet <dictionary|files>
 ```
 
或
 
 ```
 go vet <dictionary|files>
 ```

## `go vet` 与`go tool vet` 
1. go vet，只在一个单独的包内可用，不能使用flag 选项（来激活某些指定的检测）。
2. go tool vet更加完整，它可用用于文件和目录。目录被递归遍历来找到包。go tool vet也可以按照检测的分组激活选项。

（可以打开一个终端，比较go vet --help 和go tool vet --help两个命令的不同。）

> 参考文献
> 
> * https://studygolang.com/articles/9619
 

# go convey
## 功能

1. goconvey是一个支持golang的单元测试框架
2. goconvey能够自动监控文件修改并启动测试，并可以将测试结果实时输出到web界面
3. goconvey提供了丰富的断言简化测试用例的编写 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 