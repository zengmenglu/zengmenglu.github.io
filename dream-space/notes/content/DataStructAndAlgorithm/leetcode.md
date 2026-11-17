<div>

# 目录

- [42. 缺失的第一个正数](#42)
- [46. 全排列](#46)
- [94. 二叉树的中序遍历](tree.html#leetcode94)
- [96. 不同的二叉搜索树](#96)
- [102. 二叉树的层次遍历](tree.html#leetcode102)
- [105. 从前序与中序遍历序列构造二叉树](tree.html#leetcode105)
- [106. 从中序与后序遍历序列构造二叉树](tree.html#leetcode106)
- [144. 二叉树的前序遍历](tree.html#leetcode144)
- [145. 二叉树的后序遍历](tree.html#leetcode145)
- [153. 寻找旋转排序数组中的最小值](#153)
- [200. 岛屿数量](#200)
- [403. 青蛙过河](#403)
- [698. 划分为k个相等的子集](#698)
- [779. 第K个语法符号](#779)
- [794. 有效的井字游戏](#794)
- [889. 根据前序和后序遍历构造二叉树](tree.html#leetcode889)
- [894. 所有可能的满二叉树](#894)
- [912. 排序数组](#912)
- [923. 三数之和的多种可能](#923)
- [993. 二叉树的堂兄弟节点](#993)
- [1028. 从先序遍历还原二叉树](tree.html#leetcode1028)
- [1277. 统计全为 1 的正方形子矩阵](#1277)
- [1278. 分割回文串 III](#1278)

# <a href="https://leetcode-cn.com/problems/first-missing-positive/" id="42" target="_blank">42. 缺失的第一个正数</a>

给定一个未排序的整数数组，找出其中没有出现的最小的正整数。

与剑指 offer第三题类似，不同之处在于可能出现负数或大于数组长度n的数。对于这样的数跳过即可，对其他1～n的数换到下标0～n-1的位置。如果数组内数据为\[1,2,...,n\], 那么第一个未出现的正数是n+1，所以第一个未出现的正数范围是1～n+1。

- nums\[i\] == i+1 符合置换条件，不需要交换。
- nums\[i\] == nums\[nums\[i\]-1\] 两个交换值相等的情况下，会产生死循环，所以也无需交换，继续下一个。

<!-- -->

    func firstMissingPositive(nums []int) int {
        n := len(nums)
        for i := 0; i < n; {
            for (i< n) && (nums[i] <= 0 || nums[i] > n || nums[i] == i+1 || nums[i] == nums[nums[i]-1]){
                i++
            }
            if i< n {
                nums[i], nums[nums[i]-1] =  nums[nums[i]-1],nums[i]       
            }
        }
        for i:=0;i<n;i++{
            if nums[i]!=i+1{
                return i+1
            }
        }
        return n+1
    }

# <a href="https://leetcode-cn.com/problems/permutations/" id="46" target="_blank">46. 全排列</a>

给定一个没有重复数字的序列，返回其所有可能的全排列。

*TAG：【递归】【回溯】*

假设数字序列为`[0...n-1]`,首先是确定第一个数，将序号为0～n-1的数分别与第一个数交换位置。交换完了之后要恢复数组原貌，再确定第二个数，将第二个数后面所有数字和第二个数交换。如此，直到确定了所有数之后就得到了一个结果。

- 注意这里储存结果的二维数组必须得使用指针，否则结果传不出来。
- 如果不恢复原貌，得到的结果会有重复，并且得到的结果不全。
- 交换一定要从start开始，而不是start+1，

<!-- -->

    func permute(nums []int) [][]int {
        var results [][]int
        backTrace(nums, &results,0)
        return results
    }

    func backTrace(nums []int, results *[][]int, start int){
        if start == len(nums){
            *results = append(*results,append([]int{},nums...))
        }
        for i := start; i < len(nums); i++{
            nums[start],nums[i] = nums[i],nums[start] // 交换
            backTrace(nums, results, start+1) // 计算下一个数
            nums[start],nums[i] = nums[i],nums[start] // 恢复原貌
        }
    }

# <span id="96" href"https:="" leetcode-cn.com="" problems="" unique-binary-search-trees="" "="">96. 不同的二叉搜索树</span>

给定一个整数 n，求以 1 ... n 为节点组成的二叉搜索树有多少种？

TAG：【动态规划】

本题是一维的动态规划算法，构造`result[i]`代表`1～i`组成的二叉搜索树的种类。可以知道m~n的二叉搜索树的种类等于1～n-m+1为节点组成的二叉搜索树。又根据二叉搜索树的性质，root左边的数小于root，右边的数大于root。因此，1～i为节点的二叉搜索树的种类是以1～i分别为root时左右两边二叉树种类的乘积。

    func numTrees(n int) int {
        var result = make([]int, n+1)
        result[0] = 1
        result[1] = 1
        for i:=2;i<=n;i++{  
            for r:=1;r<=i;r++{// 以r为root
                    result[i] += result[r-1]*result[i-r]
            }
        }
        return result[n]
    }

# <a href="https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/" id="153" target="_blank">153. 寻找旋转排序数组中的最小值</a>

假设按照升序排序的数组在预先未知的某个点上进行了旋转。( 例如，数组 \[0,1,2,4,5,6,7\] 可能变为 \[4,5,6,7,0,1,2\] )。请找出其中最小的元素。你可以假设数组中不存在重复元素。

旋转数组前半部分所有数字值大于后半部分，需要找到旋转点。所以判断一截数组，如果第一个元素大于最后一个元素，说明这截数组仍然是旋转数组。

- 要判断`end-start==1`的情况，应为当这种情况下，`mid=(start+end)/2`会出现`mid==start`，从而造成死循环。
- 本题假设没有重复数字，当有重复数字时，会有nums\[start\] == nums\[end\]==nums\[mid\]的情况，这个时候需要顺序查找最小值。

<!-- -->

    func findMin(nums []int) int {
        if len(nums) == 0 {
            return 0
        }
        start, end :=0, len(nums)-1
        for nums[start] > nums[end]{
            if end -start == 1{
                return nums[end]
            }
            mid := (start + end)/2
            if nums[start] >= nums[mid] {
                end = mid
            } else if nums[start] <= nums[mid]{
                start = mid
            }
        }
        return nums[start]
    }

# <a href="https://leetcode-cn.com/problems/number-of-islands/submissions/" id="200" target="_blank">200. 岛屿数量</a>

给定一个由 '1'（陆地）和 '0'（水）组成的的二维网格，计算岛屿的数量。一个岛被水包围，并且它是通过水平方向或垂直方向上相邻的陆地连接而成的。你可以假设网格的四个边均被水包围。

*TAG:【图】【递归】【深度优先】【广度优先】*

深度优先搜索：关键词递归

1.  从某个点开始，如果值是1，说明至少有1个岛，岛屿的数量+1.
2.  然后从这个点开始深度优先深度从上下左右四个方向开始深度优先搜索，直到遍历到值是0的点，将之前遍历到的值是1的点改成0.
3.  知道所有点被遍历完为止。

广度优先搜索：关键词队列

1.  与深度优先搜索一样，不同点在于，把当前节点周围值为1的节点都存储下来，依次遍历直到邻接点是0为止。

<!-- -->

    // 深度优先搜索
    func numIslands(grid [][]byte) int {
        result := 0
        for i := 0; i < len(grid); i++ {
            for j := 0; j < len(grid[i]); j++ {// 遍历每一个点
                if grid[i][j] == '1' {
                    result++
                    grid[i][j] = '0'
                    dfs(&grid, i, j) // 发散深度优先搜索
                }
            }
        }
        return result
    }

    func dfs(grid *[][]byte, x, y int) {
        if x-1 >= 0 && (*grid)[x-1][y] == '1' {
            (*grid)[x-1][y] = '0'
            dfs(grid, x-1, y)
        }
        if x+1 < len((*grid)) && (*grid)[x+1][y] == '1' {
            (*grid)[x+1][y] = '0'
            dfs(grid, x+1, y)
        }
        if y-1 >= 0 && (*grid)[x][y-1] == '1' {
            (*grid)[x][y-1] = '0'
            dfs(grid, x, y-1)
        }
        if y+1 < len((*grid)[x]) && (*grid)[x][y+1] == '1' {
            (*grid)[x][y+1] = '0'
            dfs(grid, x, y+1)
        }
    }

    // 广度优先算法
    func numIslands(grid [][]byte) int {
        if len(grid) == 0{
            return 0
        }
        result := 0
        neigbor := make([]int, 0)
        row := len(grid)
        col:=len(grid[0])
        for i := 0; i < row; i++ {
            for j := 0; j < col; j++ {
                if grid[i][j] == '1' {
                    result++
                    grid[i][j] = '0'
                    neigbor = append(neigbor,i*col+j)  //  队列存储节点的邻接节点
                    for len(neigbor)>0{
                        x,y:=neigbor[0]/col,neigbor[0]%col
                        neigbor = neigbor[1:]
                        if x-1 >= 0 && grid[x-1][y] == '1' {
                            grid[x-1][y] = '0'
                            neigbor = append(neigbor, (x-1)*col+y)
                        }
                        if x+1 < len(grid) && grid[x+1][y] == '1' {
                            grid[x+1][y] = '0'
                            neigbor = append(neigbor, (x+1)*col+y)
                        }
                        if y-1 >= 0 && grid[x][y-1] == '1' {
                            grid[x][y-1] = '0'
                            neigbor = append(neigbor, x*col+y-1)
                        }
                        if y+1 < len(grid[x]) && grid[x][y+1] == '1' {
                            grid[x][y+1] = '0'
                            neigbor = append(neigbor, x*col+y+1)
                        }
                    }
                }
            }
        }
        return result
    }

# <a href="https://leetcode-cn.com/problems/frog-jump/" id="403" target="_blank">403. 青蛙过河</a>

给定石子的位置列表（用单元格序号升序表示）， 请判定青蛙能否成功过河（即能否在最后一步跳至最后一个石子上）。 开始时， 青蛙默认已站在第一个石子上，并可以假定它第一步只能跳跃一个单位（即只能从单元格1跳至单元格2）。如果青蛙上一步跳跃了 k 个单位，那么它接下来的跳跃距离只能选择为 k - 1、k 或 k + 1个单位。 另请注意，青蛙只能向前方（终点的方向）跳跃。实例：输入\[0,1,3,5,6,8,12,17\]，输出true。

*TAG：【动态规划】*

本题涉及二维的动态规划

- dp\[i\]\[j\] 表示在stones\[i\]上可以跳跃j步。
- 当计算到dp\[i\]\[j\]， i=n-1且存在为true的j时，说明前一个节点也可以跳j步到达这最后一个石头上。

<!-- -->

    func canCross(stones []int) bool {
        var dp = make([][]bool, len(stones)) // 在stones[i]上可以跳跃j步
        for i := range dp {
            dp[i] = make([]bool, len(stones))
        }
        dp[0][1] = true
        for i := 1; i < len(stones); i++ {
            for j := 0; j < i; j++ {
                dis := stones[i] - stones[j]
                if dis <= 0 || dis >= len(stones) || !dp[j][dis] {continue}// dis的范围判断是为了dp[j][dis]下标不越界
                if i == len(stones)-1 {return true} // 成功判定
                dp[i][dis] = true // 更新dp数组
                if dis-1 > 0 {    dp[i][dis-1] = true}
                if dis+1 < len(stones) {dp[i][dis+1] = true}
            }
        }
        return false
    }

# <a href="" id="698">698. 划分为k个相等的子集</a>

给定一个整数数组 nums 和一个正整数 k，找出是否有可能把这个数组分成 k 个非空子集，其总和都相等。

输入： nums = \[4, 3, 2, 3, 5, 2, 1\], k = 4

输出： True

说明： 有可能将其分成 4 个子集（5），（1,4），（2,3），（2,3）等于总和。

*TAG：【数组】【递归】【动态规划】*

    func canPartitionKSubsets(nums []int, k int) bool {
        total := 0
        for i := range nums {
            total += nums[i]
        }
        if k <= 0 || total%k != 0 {
            return false
        }
        sum := total / k
        sort.Ints(nums)
        lastIdx := len(nums) - 1
        for i := len(nums) - 1; i >= 0; i-- {
            if nums[i] > sum {
                return false
            }
            if nums[i] == sum {
                lastIdx--
                k--
            }
            if nums[i] < sum {
                break
            }
        }
        record := make([]int, k)
        return canPartitionKSubsetsRecurse(nums, record, lastIdx, sum)
    }

    func canPartitionKSubsetsRecurse(nums, record []int, lastIdx, sum int) bool { // 递归
        if lastIdx < 0 {
            return true
        }
        for i := range record {
            if record[i]+nums[lastIdx] <= sum {
                record[i] += nums[lastIdx]
                if canPartitionKSubsetsRecurse(nums, record, lastIdx-1, sum) { // 子问题
                    return true
                }
                record[i] -= nums[lastIdx]
            }
            if record[i] == 0 {
                return false
            }
        }
        return false
    }

# <a href="https://leetcode-cn.com/problems/k-th-symbol-in-grammar/submissions/" id="779" target="_blank">779. 第K个语法符号</a>

在第一行我们写上一个 0。接下来的每一行，将前一行中的0替换为01，1替换为10。给定行数 N 和序数 K，返回第 N 行中第 K个字符。（K从1开始）

*TAG：【数组】【递归】*

- 按照递归2步走：终止条件，递归式。

<!-- -->

    func kthGrammar(N int, K int) int {
        if N<=1||K<=1{
            return 0
        }
        return (1-kthGrammar(N-1,(K+1)/2))^(K%2)
    }

# <a href="https://leetcode-cn.com/problems/valid-tic-tac-toe-state/" id="794" target="_blank">794. 有效的井字游戏</a>

用字符串数组作为井字游戏的游戏板 board。当且仅当在井字游戏过程中，玩家有可能将字符放置成游戏板所显示的状态时，才返回 true。该游戏板是一个 3 x 3 数组，由字符 " "，"X" 和 "O" 组成。字符 " " 代表一个空位。 以下是井字游戏的规则： 玩家轮流将字符放入空位（" "）中。 第一个玩家总是放字符 “X”，且第二个玩家总是放字符 “O”。 “X” 和 “O” 只允许放置在空位中，不允许对已放有字符的位置进行填充。 当有 3 个相同（且非空）的字符填充任何行、列或对角线时，游戏结束。 当所有位置非空时，也算为游戏结束。 如果游戏结束，玩家不允许再放置字符。

*TAG：【数组】【二维】*

本题就是找规律，分为以下3个特殊情形：

1.  X棋子先下，因此X的数量比O多1个，或者与O相等，其他情况说明不符合游戏规则，返回false。
2.  当X满足赢的条件的时候，X数量比O多1，否则返回false。
3.  当O满足赢的条件的时候，O数量和X一样多，否则返回false。

<!-- -->


    func validTicTacToe(board []string) bool {
        cntO,cntX:=count(board)
        if cntX-cntO!= 1 && cntX-cntO!=0{ // 条件1判断
            return false
        }
        if win(board,'X') && cntX-cntO!=1{ // 条件2判断
            return false
        }
        if win(board,'O') && cntX!=cntO{ // 条件3判断
            return false
        }
        return true
    }
    func count(board []string)(int,int){ // 获取X和O棋子的个数
        var cntO, cntX int
        for j := 0; j < len(board); j++ {
            for k := 0; k < len(board[0]); k++ {
                if board[j][k] == 'O' {
                    cntO++
                } else if board[j][k] == 'X' {
                    cntX++
                }
            }
        }
        return cntO,cntX
    }
    func win(board []string, winner byte)bool{ // 判断棋子winner是否满足赢的条件
        for i:=0;i<len(board);i++{
            if (board[i][0]==winner && board[i][1]==winner && board[i][2]==winner)||
                (board[0][i]==winner && board[1][i]==winner && board[2][i]==winner){
                return true
            }
        }
        if (board[0][0] == winner && board[1][1] == winner && board[2][2]==winner)||
            (board[2][0] == winner && board[1][1] == winner && board[0][2]==winner){
            return true
        }
        return false
    }

# <a href="https://leetcode-cn.com/problems/all-possible-full-binary-trees/submissions/" id="894" target="_blank">894. 所有可能的满二叉树</a>

满二叉树是一类二叉树，其中每个结点恰好有 0 或 2 个子结点。返回包含 N 个结点的所有可能满二叉树的列表。 答案的每个元素都是一个可能树的根结点。答案中每个树的每个结点都必须有 node.val=0。你可以按任何顺序返回树的最终列表。

*TAG：【递归】【树】*

- 递归的思路，N个节点时，根节点占用一个节点，左右子孩子占有N-1个节点，由于是满二叉树，因此如果存在左孩子，必定需要有右孩子，反之亦然。遍历左孩子占用节点树为1～N-2的情况，得出左孩子可能的根节点的数据，将这些根节点接上原始root，则得到了不同的目标答案。
- 核心在于构建递归函数的入参和出参。理论上，递归函数是可以不设置任何出参的，可以在入参中存储结果。（需要存储结果的原因在于存储下子问题的解，避免重复子问题计算）。由于目标结果是树的头节点的切片`[]*TreeNode`，因此如果我们需要存在子问题的解，则需要存节点数为1～N范围的结果值，因此，存储结果的类型设置为`[][]*TreeNode`.

<!-- -->

    func allPossibleFBT(N int) []*TreeNode {
        if N == 0 {
            return nil
        }
        store := make([][]*TreeNode, N+1)
        findTree(N, &store)
        return store[N]
    }

    func findTree(N int, store *[][]*TreeNode) {
        if N == 1 {
            (*store)[N] = []*TreeNode{&TreeNode{0, nil, nil}}
            return
        }

        result := make([]*TreeNode, 0)
        for i := 1; i < N-1; i++ {
            var left, right []*TreeNode
            if len((*store)[i]) == 0 {
                findTree(i, store)
            }
            left = (*store)[i]
            if len((*store)[N-1-i]) == 0 {
                findTree(N-1-i, store)
            }
            right = (*store)[N-1-i]

            // 递归的核心处
            for j := range left {
                for k := range right {
                    root := &TreeNode{0, left[j], right[k]}
                    result = append(result, root)
                }
            }
        }
        (*store)[N] = result
    }

# <a href="https://leetcode-cn.com/problems/sort-an-array/" id="912" target="_blank">912. 排序数组</a>

给定一个整数数组 nums，将该数组升序排列。

TAG：【排序】【数组】

快速排序:

    func quickSort(nums []int){
        partition(nums, 0, len(nums)-1)
    }
    func partition(nums []int, start, end int){
        if start >= end{
            return
        }
        var i, j  = start, end
        pivot:=nums[start]
        for i < j{
            for ;i<j;j--{  //从尾开始，将不小于pivot的值放在左边
                if nums[j]<=pivot{
                    nums[i] = nums[j]
                    i++
                    break
                }
            }
            for ;i<j;i++{ // 从首开始
                if nums[i]>=pivot{
                    nums[j] = nums[i]
                    j--
                    break
                }
            }
        }
        nums[i] = pivot // 置位
        partition(nums, start, i-1) // 分治
        partition(nums, i+1, end)
    }

堆排序：

    func heapSort(nums []int){
        for i:=len(nums)/2-1;i>=0;i--{ // 从最后一个非叶子结点开始调整，构造一个完成最大堆
            heaplify(nums, i, len(nums)-1)
        }
        for j:=len(nums)-1;j>=1;j--{// 将堆定最大元素取出，将堆最后一个叶子结点放在堆定，再调整
            nums[0],nums[j] = nums[j],nums[0]
            heaplify(nums,0,j-1)
        }
    }
    func heaplify(nums []int, start, end int){// 堆的调整
        for i := start; i<=end; {
            left:=2*i+1
            right:=2*i+2
            if left<=end && nums[left]>nums[i] && (right > end || nums[right]<=nums[left]){
                nums[left],nums[i] = nums[i],nums[left]
                i=left
            }else if right <= end && nums[right]>nums[i]{
                nums[right],nums[i] = nums[i],nums[right]
                i=right
            }else{
                break
            }
        }
    }

# <a href="https://leetcode-cn.com/problems/3sum-with-multiplicity/submissions/" id="923" target="_blank">923. 三数之和的多种可能</a>

给定一个整数数组 A，以及一个整数 target 作为目标值，返回满足 i \< j \< k 且 A\[i\] + A\[j\] + A\[k\] == target 的元组 i, j, k 的数量。由于结果会非常大，请返回 结果除以 10^9 + 7 的余数。（3 \<= A.length \<= 3000，0 \<= A\[i\] \<= 100，0 \<= target \<= 300）

*【三指针】*

- 由于数字大小范围为0～100，首先采用桶排序，对A数组中的数字出现的次数进行统计，record\[i\]表示数字i出现的次数，如果没有数字i，则record\[i\]=0。
- 定好第一个数，另外两个数分别用首尾指针确定，由于可能出现3个数字中有相同的数的情况，首指针从第一个数的位置开始，首尾指针可以相等。
- 注意判断特殊情况，第一个数和第二个数相等，第二个数和第三个数相等的情况。

<!-- -->

    func threeSumMulti(A []int, target int) int {
        const maxResult = 1000000007
        const maxNum = 100
        var record = make([]int, maxNum+1)
        for i := range A {
            record[A[i]]++
        }
        result := 0
        for i := 0; i < len(record); i++ {
            if record[i] == 0 {
                continue
            }
            left := target - i
            for j, k := i, len(record)-1; k >= j; {
                if record[j] == 0 || j+k < left {
                    j++
                    continue
                }
                if record[k] == 0 || j+k > left {
                    k--
                    continue
                }
                if i < j && j < k {
                    result = (result + record[i]*record[j]*record[k]) % maxResult
                } else if i == j && j < k && record[i] >= 2 {
                    result = (result + ((record[i]*(record[i]-1))/2)*record[k]) % maxResult
                } else if i < j && j == k && record[j] >= 2 {
                    result = (result + ((record[j]*(record[j]-1))/2)*record[i]) % maxResult
                } else if record[i] >= 3 {
                    result = (result + ((record[j] * (record[j] - 1) * (record[j] - 2)) / 6)) % maxResult
                }
                j++
                k--
            }
        }
        return result
    }

# <a href="https://leetcode-cn.com/problems/cousins-in-binary-tree/" id="993" target="_blank">993. 二叉树的堂兄弟节点</a>

在二叉树中，根节点位于深度 0 处，每个深度为 k 的节点的子节点位于深度 k+1 处。如果二叉树的两个节点深度相同，但父节点不同，则它们是一对堂兄弟节点。我们给出了具有唯一值的二叉树的根节点 root，以及树中两个不同节点的值 x 和 y。只有与值 x 和 y 对应的节点是堂兄弟节点时，才返回 true。否则，返回 false。

TAG：【树】

递归分别求x和y的深度和父节点的值。

    func isCousins(root *TreeNode, x int, y int) bool {
        var xParent, yParent, xdepth, ydepth int
        xflg:=isChild(root,x,&xParent,&xdepth)
        yflg:=isChild(root, y,&yParent,&ydepth)
        if !xflg || !yflg || xParent == yParent || xdepth!=ydepth {
            return false
        }
        return true
    }

    func isChild(root *TreeNode, val int, parent *int, depth *int) (bool){
        if root == nil { return false}
        if (root.Left != nil && root.Left.Val== val) || (root.Right != nil && root.Right.Val== val){
            *parent = root.Val
            *depth+=1
            return true
        }
        if isChild(root.Left, val, parent, depth) || isChild(root.Right, val, parent,depth){
            *depth+=1
            return true
        }
        return false
    }

# <a href="https://leetcode-cn.com/problems/count-square-submatrices-with-all-ones/" id="1277" target="_blank">1277. 统计全为 1 的正方形子矩阵</a>

给你一个 m \* n 的矩阵，矩阵中的元素不是 0 就是 1，请你统计并返回其中完全由 1 组成的 正方形 子矩阵的个数。

    输入：matrix =
    [
      [0,1,1,1],
      [1,1,1,1],
      [0,1,1,1]
    ]
    输出：15
    解释： 
    边长为 1 的正方形有 10 个。
    边长为 2 的正方形有 4 个。
    边长为 3 的正方形有 1 个。
    正方形的总数 = 10 + 4 + 1 = 15.

按照边长1～min(row,col)的小正方形的情况，暴力求解。

# <a href="https://leetcode-cn.com/problems/palindrome-partitioning-iii/" id="1278" target="_blank">1278. 分割回文串 III</a>

给你一个由小写字母组成的字符串 s，和一个整数 k。

请你按下面的要求分割字符串：

首先，你可以将 s 中的部分字符修改为其他的小写英文字母。 接着，你需要把 s 分割成 k 个非空且不相交的子串，并且每个子串都是回文串。 请返回以这种方式分割字符串所需修改的最少字符数。

    输入：s = "abc", k = 2
    输出：1
    解释：你可以把字符串分割成 "ab" 和 "c"，并修改 "ab" 中的 1 个字符，将它变成回文串。

    dp[i][j] = min(dp[i][j],dp[m][j-1]+cost[m+1][i]), m=1...i-1

`dp[i][j]` 代表字符串s前i个字符分成j个子串需要修改的最少字符数，`cost[m][n]`代表字符串第m到n个字符的子串变成回文需要修改的最小字符数。（下标均为从1开始）

    func initCost(s string) [][]int { // cost[i][j]表示第i～j字符段成为回文需要变化的次数，下标0开始
        var cost = make([][]int, len(s))
        for i := 0; i < len(s); i++{
            cost[i] = make([]int, len(s))
            for j := i+1; j < len(s); j++{
                for m,n := i,j; m < n ; m,n = m+1, n-1 {
                    if s[m] != s[n]{
                        cost[i][j]++
                    }
                }
            }
        }
        return cost
    }

    func palindromePartition(s string, k int) int {
        var cost = initCost(s)
        var dp = make([][]int, len(s)+1) // dp[i][j]表示0～（i-1）前i个字符段分成k份，每份为回文的次数
        for i := 1; i <= len(s); i++ {
            dp[i] = make([]int, k+1)
            dp[i][1]=cost[0][i-1]
            for j := 2; j <= k && j < i; j++ {
                dp[i][j] = len(s)
                for m := 1; m < i; m++{
                    dp[i][j] = min(dp[i][j],dp[m][j-1]+cost[m][i-1])
                }
            }
        }
        return dp[len(s)][k]
    }

    func min(a, b int) int{
        if a < b {
            return a
        }
        return b
    }

</div>
