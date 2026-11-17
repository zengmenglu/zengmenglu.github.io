<div>

# 计算机网络

## 计算机网络7层模型

1.  网络分层的意义在于便于管理。
2.  7层模型中，上三层为用户提供服务；下四层为数据传输提供服务，且物理层才是真正用于传输实际数据。

<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<thead>
<tr>
<th>网络层次</th>
<th>协议</th>
<th>功能</th>
<th>数据单位</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="applicationLayer.html">应用层</a></td>
<td><a href="applicationLayer.html#HTTP">HTTP</a>，FTP</td>
<td>1. 用户接口</td>
<td>APDU<br />
应用协议数据单元</td>
</tr>
<tr>
<td>表示层</td>
<td></td>
<td><p>1. 将数据翻译成01（英文ASCII，中文GB2312，图片jpg，音频mp3等）。</p>
<p>2. 加密、压缩</p></td>
<td>PPDU<br />
表示层协议数据单元</td>
</tr>
<tr>
<td>会话层</td>
<td></td>
<td>1. 确定网络数据是否要经过远程会话<br />
（如果不需要进行远程传递，则不会发给传输层，而是直接让磁盘储存。）</td>
<td>SPDU<br />
会话协议数据单元</td>
</tr>
<tr>
<td>传输层</td>
<td>TCP,UDP</td>
<td><p>1. 确定端口号（不同端口号对应不同的服务）</p>
<p>2. 确定传输协议可靠/不可靠</p>
<p>3. 传输前的错误检测，流控</p></td>
<td>TPDU<br />
数据段</td>
</tr>
<tr>
<td>网络层</td>
<td><p>1. IP</p>
<p>2. ICMP<br />
(互联网控制报文协议, ping操作应用此协议)</p>
<p>3. IGMP(互联网组管理协议)</p></td>
<td>1. 提供逻辑地址（IP）、选路</td>
<td>IP数据报文<br />
保存IP地址信息</td>
</tr>
<tr>
<td>数据链路层</td>
<td>CSMA,CDMA，ARP</td>
<td><p>1. 成帧</p>
<p>2. 用MAC地址访问文件（MAC用于局域网）</p>
<p>3. 错误检测与修正</p>
<p>4. 采用载波监听多路访问模式</p></td>
<td>MAC 帧<br />
保存了硬件MAC地址</td>
</tr>
<tr>
<td>物理层</td>
<td></td>
<td>1. 负责设备之间比特流的传输，物理接口、电气特性等（网线、网卡）</td>
<td>01比特流</td>
</tr>
</tbody>
</table>

</div>
