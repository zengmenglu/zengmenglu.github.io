

# 性能与调试

## pprof

### 预备工作
 安装graphviz. 在终端输入下列命令下载即可。
 >$ brew install graphviz

### 性能分析

性能分析分为两种应用场景：

1. [临时测试](#临时测试)，一次测试结束后即可。这种方式采用```"runtime/pprof"```包，会将性能数据写入一个文件。
2. 程序[持续性在运行](#持续测试)。

#### 临时测试

在main 函数处加上下面语句

```
import "runtime/pprof"

var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to file")

func main(){
	flag.Parse()
	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			log.Fatal(err)
		}
		pprof.StartCPUProfile(f)
		defer pprof.StopCPUProfile()

	}

	// your code
}
```
web
需要设置svg的默认打开程序是浏览器。

会自动打开
 > go tool pprof --http=:8080 mem.prof 


#### 持续测试

热点图

[Go 语言的高级调试方法](https://mp.weixin.qq.com/s/Abyeuzu5Su6MA_efThItbA)
[视频](https://www.bilibili.com/video/av87482478)