# GO Debug 

Go 调试的方式有很多种，包括通用的[Rubber duck debugging](https://baijiahao.baidu.com/s?id=1606585309623118642&wfr=spider&for=pc), 打印，古早的GDB（适合CGO项目的调试），以及go专属的调试工具delve。此外，golang 提供了一种可以进行[Google Analytics(GA)](https://www.jianshu.com/p/3ad64d555e1d)用户活动追踪的第三方库[ogle](https://github.com/jpillora/go-ogle-analytics).

## 打印

这里主要介绍第三方库[go-spew](#go-spew)。
 
### go-spew

go的第三方库[go-spew](https://github.com/davecgh/go-spew)对go的原始打印方法进行了封装，可以打印出数据的详细数据结构、地址(如果是指针类型)、值内容，用于go的debug。[🔗GoDoc1](http://godoc.org/github.com/davecgh/go-spew/spew),[🔗GoDoc2](https://pkg.go.dev/github.com/davecgh/go-spew/spew?tab=doc).

go-spew 提供了诸如spew.Dump 以及spew.Println等方法。

快速开始：

```
import "github.com/davecgh/go-spew/spew"
type stru struct{
	i int
}
func main(){
	var a=100
	var b=stru{200}
	var c=&stru{200}
	spew.Dump(a)
	spew.Dump(b)
	spew.Dump(c)
}
```
输出结果：<br>
(int) 100<br>
(main.stru) {<br>
 i: (int) 200<br>
}<br>
(*main.stru)(0xc0000161b0)({<br>
 i: (int) 200<br>
})<br>

## <a href="https://github.com/go-delve/delve">delve</a>


dlv debug xx.go

* (dlv)b package.func 设置断点
	* (dlv)c 继续 continue
	* (dlv)n 下一步
	* （dlv）s 进入函数 step
	* （dlv）stepout 跳出函数
	*  (dlv) p varname 打印
	* (dlv)set val
	* (dlv)cal func
	* (dlv)config -list
	* (dlv)help
 

### dwarf 二进制调试数据

[dwarf](https://studygolang.com/articles/25914)

dwarf gp build -ldflags=-w



* dlv debug
	* dlv test
	*
