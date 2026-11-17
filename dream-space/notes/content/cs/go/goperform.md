<div>

# 性能与调试

## pprof

### 预备工作

安装graphviz. 在终端输入下列命令下载即可。

> \$ brew install graphviz

### 性能分析

性能分析分为两种应用场景：

1.  [临时测试](#%E4%B8%B4%E6%97%B6%E6%B5%8B%E8%AF%95)，一次测试结束后即可。这种方式采用`"runtime/pprof"`包，会将性能数据写入一个文件。
2.  程序[持续性在运行](#%E6%8C%81%E7%BB%AD%E6%B5%8B%E8%AF%95)。

#### 临时测试

在main 函数处加上下面语句

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

web 需要设置svg的默认打开程序是浏览器。

会自动打开

> go tool pprof --http=:8080 mem.prof

#### 持续测试

热点图

<a href="https://mp.weixin.qq.com/s/Abyeuzu5Su6MA_efThItbA" target="_blank">Go 语言的高级调试方法</a> <a href="https://www.bilibili.com/video/av87482478" target="_blank">视频</a>

</div>
