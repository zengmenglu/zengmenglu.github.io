<div>

# 二叉树分类

1.  满二叉树：每个结点恰有0个或2个子结点。
2.  搜索二叉树： 左叶子 \< 根 \< 右叶子

# 二叉树的遍历

树的遍历方式分为[深度优先搜索遍历（DFS）](#dfs)与[宽度优先搜索遍历（BFS）](#bfs)。

- DFS采用深度作为优先级，从根开始一直遍历到某一确定节点，再返回根到达另外一个分支。DFS又可以根据树的根节点遍历的顺序分为[前序遍历](#leetcode144)，[中序遍历](#leetcode94)与[后序遍历](#leetcode145)。二叉树的遍历还涉及根据遍历结果[重建二叉树](#%E9%87%8D%E5%BB%BA%E4%BA%8C%E5%8F%89%E6%A0%91), [验证有效二叉树](#%E9%AA%8C%E8%AF%81%E4%BA%8C%E5%8F%89%E6%A0%91)。

- BSF按照高度层次逐层遍历树，层次高的节点优先于层次低的的节点被遍历。BFS包含树的[层序遍历](#leetcode102)

## DFS

### <a href="https://leetcode-cn.com/problems/binary-tree-preorder-traversal/" id="leetcode144" target="_blank">前序遍历</a>

1.  设置一个栈`nodeSaver`一次存储根节点、右节点、左节点。
2.  下一次遍历，栈顶弹出上一次的左节点Left，并继续压栈Left的右、左节点。
3.  如此，先遍历了根和左节点，最后遍历右节点。

<!-- -->

    func preorderTraversal(root *TreeNode) []int {
        if root == nil {
            return nil
        }
        nodeSaver, res := []*TreeNode{root}, []int{} // 栈初始化
        for len(nodeSaver) > 0 {
            curNode := nodeSaver[len(nodeSaver)-1]
            nodeSaver = nodeSaver[:len(nodeSaver)-1] // 根节点出栈
            res = append(res, curNode.Val)
            if curNode.Right != nil {
                nodeSaver = append(nodeSaver, curNode.Right) // 右节点压栈
            }
            if curNode.Left != nil {
                nodeSaver = append(nodeSaver, curNode.Left) // 左节点压栈
            }
        }
        return res
    }

### <a href="https://leetcode-cn.com/problems/binary-tree-inorder-traversal/solution/" id="leetcode94" target="_blank">中序遍历</a>

1.  设置一个栈用于存储当前节点往下遍历的所有的根和左子树的节点。
2.  当当前节点遍历到末端（nil）时，开始弹栈，依次将左子树和根弹出，最后随后当前根节点的右叶子。

<!-- -->

    func inorderTraversal(root *TreeNode) []int {
        if root == nil {
            return nil
        }
        var nodeSaver []*TreeNode
        var res []int
        for cur := root; cur != nil || len(nodeSaver) > 0; {
            for cur != nil { 
                nodeSaver = append(nodeSaver, cur) // 当前节点向下的所有根、左叶子压栈
                cur = cur.Left
            }
            cur = nodeSaver[len(nodeSaver)-1]
            nodeSaver = nodeSaver[:len(nodeSaver)-1] // 左叶子/根出栈
            res = append(res, cur.Val)
            cur = cur.Right // 处理右叶子
        }
        return res
    }

### <a href="https://leetcode-cn.com/problems/binary-tree-postorder-traversal/submissions/" id="leetcode145" target="_blank">后序遍历</a>

1.  方法与前序遍历类似，前序遍历的顺序是根左右；后序顺序是左右根，后序结果逆序之后是根右左。
2.  因此设置节点压栈顺序是根、左、右，存储结果的时候，需要把当前节点的值放在前面（即结果需要逆序）

<!-- -->

    func postorderTraversal(root *TreeNode) []int {
        if root == nil{
            return nil
        }
        nodeSaver, res := []*TreeNode{root}, []int{} // 栈初始化
        for len(nodeSaver) > 0 {
            cur := nodeSaver[len(nodeSaver)-1]
            nodeSaver = nodeSaver[:len(nodeSaver)-1] // 根节点出栈
            res = append([]int{cur.Val}, res...) // 结果逆序存储
            if cur.Left != nil{
                nodeSaver = append(nodeSaver, cur.Left) //  左节点压栈
            }
            if cur.Right!= nil{
                nodeSaver = append(nodeSaver, cur.Right) // 右节点压栈
            }
        }
        return res
    }

### 重建二叉树

1.  两种遍历序列可以确定二叉树的结构，但当且仅当其中一种遍历方式是[中序遍历](#%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86)时，才能唯一确定一个二叉树结构。
2.  [由前中序构造二叉树](#leetcode105), [由中后序构造二叉树](#leetcode106) 可以构造一棵唯一的二叉树；仅[由前后序构造二叉树](#leetcode889)可以构造多种二叉树；由[变种的前序遍历](#leetcode1028)可以恢复二叉树。
3.  [翻转二叉树以匹配先序遍历](#leetcode971)

#### <a href="https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/submissions/" id="leetcode105" target="_blank">由前中序构造二叉树</a>

1.  采用递归,下面算法的前提是树中没有重复元素。前序遍历第一个节点是根节点，在中序遍历中找到根节点的位置，前半部分则是根的左叶子，后半部分是根的右叶子。

<!-- -->

    func buildTree(preorder []int, inorder []int) *TreeNode {
        if a, b := len(preorder), len(inorder); a != b || a == 0{
            return nil
        }
        root:=&TreeNode{preorder[0],nil,nil} 
        idx := 0
        for i := range inorder{
            if inorder[i] == preorder[0]{
                idx = i
                break
            }
        }
        root.Left = buildTree(preorder[1:idx+1],inorder[:idx])
        root.Right = buildTree(preorder[idx+1:],inorder[idx+1:])
        return root
    }

#### <a href="https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/submissions/" id="leetcode106" target="_blank">由中后序构造二叉树</a>

1.  几乎与[由前中序构造二叉树](#leetcode105)解法完全一致，使用递归即可。

<!-- -->

    func buildTree(inorder []int, postorder []int) *TreeNode {
        if a,b := len(inorder), len(postorder); a != b || a == 0 {
            return nil
        }
        rootVal:=postorder[len(postorder)-1]
        var idx int
        for idx=0;idx<len(inorder); 从中序与后序遍历序列构造二叉树idx++{
            if inorder[idx] == rootVal{
                break
            }
        }
        root := &TreeNode{
            rootVal,
            buildTree(inorder[:idx],postorder[:idx]),
            buildTree(inorder[idx+1:],postorder[idx:len(postorder)-1]),
        }
        return root
    }

#### <a href="https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/" id="leetcode889" target="_blank">由前后序构造二叉树</a>

1.  前序和后序遍历不能唯一确定一个二叉树结构，下面算法给出了可能的一种二叉树。
2.  前序的第一个节点和后序的最后一个节点是根节点，据此得出递归后的pre和post入参。

<!-- -->

    func constructFromPrePost(pre []int, post []int) *TreeNode {
        if a, b := len(pre), len(post); a != b || a == 0{
            return nil
        }
        root :=  &TreeNode{Val:pre[0]}
        if len(pre) == 1{
            return root
        }
        next := pre[1] // 下一个根节点
        var idx int
        for idx = 0; idx< len(post); idx++{
            if post[idx] == next{
                break
            }
        }
        root.Left = constructFromPrePost(pre[1:idx+2],post[:idx+1])
        root.Right = constructFromPrePost(pre[idx+2:],post[idx+1:len(post)-1])
        return root
    }

#### <a href="https://leetcode-cn.com/problems/recover-a-tree-from-preorder-traversal/submissions/" id="leetcode1028" target="_blank">从变种先序遍历还原二叉树</a>

我们从二叉树的根节点 root 开始进行深度优先搜索。在遍历中的每个节点处，我们输出 D 条短划线（其中 D 是该节点的深度），然后输出该节点的值。（如果节点的深度为 D，则其直接子节点的深度为 D + 1。根节点的深度为 0）。如果节点只有一个子节点，那么保证该子节点为左子节点。给出遍历输出 S，还原树并返回其根节点 root。例：输入："1-2--3--4-5--6--7" 输出：

1  
/ \\  
2 5  
/ \\ / \\  
3 4 6 7  

1.  定义了slashCount来定义数字A前面的横杠的个数。这个个数其实就代表了数字A在二叉树种的层次。（根节点是第0层）。由于使用Split函数会吞掉一个横杠，所以初始化的时候设置slashCount为1，补齐吞掉的横杠。
2.  nodeSave中存的节点，由于是前序遍历，所以可以保证任何时刻，nodeSave中存的节点，每层二叉树只有1个。所以每次在处理一个新节点之前，前将多余的左叶子节点去掉，只保留nodeSave当前层以上的节点。

<!-- -->

    func recoverFromPreorder(S string) *TreeNode {
        if len(S) == 0 {return nil}
        splitSeg := strings.Split(S, "-")
        rootVal, _ := strconv.Atoi(splitSeg[0])
        root := &TreeNode{Val: rootVal} // 第一个元素是根
        slashCount, nodeSaver := 1, []*TreeNode{root}
        for i := 1; i < len(splitSeg); i++ {
            if splitSeg[i] == "" { // 横杠计数
                slashCount++ 
                continue
            }
            val, _ := strconv.Atoi(splitSeg[i])
            nodeSaver = nodeSaver[:slashCount] // 保留当前层以上的节点
            newNode, parent := &TreeNode{Val: val}, nodeSaver[len(nodeSaver)-1]
            if parent.Left == nil {
                parent.Left = newNode
            } else {
                parent.Right = newNode
            }
            nodeSaver = append(nodeSaver, newNode)
            slashCount = 1
        }
        return root
    }

#### <a href="" id="leetcode971">翻转二叉树以匹配先序遍历</a>

给定一个有 N 个节点的二叉树，每个节点都有一个不同于其他节点且处于 {1, ..., N} 中的值。通过交换节点的左子节点和右子节点，可以翻转该二叉树中的节点。我们的目标是翻转最少的树中节点，以便树的前序遍历行程与给定的行程 voyage 相匹配。 如果可以，则返回翻转的所有节点的值的列表。你可以按任何顺序返回答案。如果不能，则返回列表 \[-1\]。例如：输入二叉树

1  
/\\  
2 3  

voyage=\[1,3,2\], 则输出 \[1\]

    func flipMatchVoyage(root *TreeNode, voyage []int) []int {
        var idx = 0
        return flipMatchVoyagePreSearch(root,voyage,&idx)
    }

    func flipMatchVoyagePreSearch(root *TreeNode, voyage []int, idx *int)[]int{
        var res []int
        if root == nil && *idx >= len(voyage) {
            return []int{-1}
        }
        if (root == nil && *idx < len(voyage)) || (root!= nil && (*idx >= len(voyage) || root.Val != voyage[*idx])){
                return []int{-1}
        }

        if  *idx+1<len(voyage) &&
            ((root.Left!= nil&& voyage[*idx+1]!=root.Left.Val)||(root.Left==nil&&root.Right!=nil&&voyage[*idx+1]!=root.Right.Val)){
            root.Left,root.Right = root.Right,root.Left
            res = append(res,root.Val)
        }
        *idx++
        if root.Left!= nil{
            left:=flipMatchVoyagePreSearch(root.Left,voyage,idx)
            if reflect.DeepEqual(left,[]int{-1}){
                return left
            }
            res = append(res, left...)
        }

        if root.Right!= nil{
            right:=flipMatchVoyagePreSearch(root.Right,voyage,idx)
            if reflect.DeepEqual(right,[]int{-1}){
                return right
            }
            res= append(res,right...)
        }

        return res
    }

### <a href="https://leetcode-cn.com/problems/validate-binary-tree-nodes/" id="leetcode1361" target="_blank">验证二叉树</a>

二叉树上有 n 个节点，按从 0 到 n - 1 编号，其中节点 i 的两个子节点分别是 leftChild\[i\] 和 rightChild\[i\]。只有 所有 节点能够形成且只形成一颗有效的二叉树时，返回 true；否则返回 false。如果节点 i 没有左子节点，那么 leftChild\[i\] 就等于 -1。右子节点也符合该规则。例如：

  0  
 / \\  
1  2  
   /  
  3  

输入： n=4, leftChild=\[1,-1,3,-1\], rightChild=\[2,-1,-1,-1\], 输出：true

1.  要点在于首先要找到根节点，根节点的特征是入度为0。
2.  从根节点开始深度优先遍历，当遍历到叶子时，如果仍存在有节点没有被遍历到，那么就说明不是一棵有效的二叉树。

<!-- -->

    func validateBinaryTreeNodes(n int, leftChild []int, rightChild []int) bool {
        var ingree = make([]int,n)
        for i:=range leftChild{  // 计算入度
            if leftChild[i]!= -1{
                ingree[leftChild[i]]++
            }
            if rightChild[i]!=-1{
                ingree[rightChild[i]]++
            }
        }

        var root int
        for i:=range ingree{ // 寻找根节点
            if ingree[i]==0{
                root = i
                break
            }
        }
        seen:=make([]bool,n) // 标记是否所有节点都被遍历到
        seen[root] =true
        return dfs(root,leftChild,rightChild,seen) && visit(seen) 
    }

    func visit(seen []bool)bool{ // 判断是否所有节点都被遍历到
        for i:=range seen{
            if !seen[i]{
                return false
            }
        }
        return true
    }

    func dfs(root int,leftChild []int, rightChild []int, seen []bool)bool{
        if root==-1{
            return true
        }
        leftFlg:=true
        if leftChild[root]!= -1 {
            if seen[leftChild[root]]{ // 节点已经被遍历，则说明不是一颗有效二叉树
                return false
            }
            seen[leftChild[root]]=true
            leftFlg = dfs(leftChild[root],leftChild,rightChild,seen)
        }
        rightFlg:=true
        if rightChild[root]!=-1{
            if seen[rightChild[root]]{
                return false
            }
            seen[rightChild[root]]=true
            rightFlg = dfs(rightChild[root],leftChild,rightChild,seen)
        }
        return leftFlg&&rightFlg
    }

## BFS

### <a href="%E2%80%9Chttps:/leetcode-cn.com/problems/binary-tree-level-order-traversal/submissions/%E2%80%9D" id="leetcode102">层序遍历</a>

1.  当层序遍历的结果只需要存在一维数组中时，只需要一个一维数组存储树的节点，一直往后面追加节点即可。
2.  有的层序遍历，如下面代码，当结果需要存到二维数组中，即每一层元素单独一个一维数组时，则需要一个二维数组存储树的节点，并用curIdx记录当前层。这里要注意容易错的点是，删除slice第一个元素的时候，不能使用`arr = append(arr, arr[1:]...)`, 这样并不是从头开始append，所以并不会删除第一个元素，反而arr的元素一直在增加。直接`arr = arr[1:]`即可。(微软2019二面面试题，就是在这个地方错了)

<!-- -->

    func levelOrder(root *TreeNode) [][]int {
        if root == nil {
            return nil
        }

        curIdx := 0
        nodeSaver, curLayer, res := [2][]*TreeNode{{root}, {}}, []int{}, [][]int{}
        for len(nodeSaver[curIdx]) > 0 {
            curNode := nodeSaver[curIdx][0]
            curLayer = append(curLayer, curNode.Val)
            if curNode.Left != nil {
                nodeSaver[1-curIdx] = append(nodeSaver[1-curIdx], curNode.Left)
            }
            if curNode.Right != nil {
                nodeSaver[1-curIdx] = append(nodeSaver[1-curIdx], curNode.Right)
            }

            nodeSaver[curIdx] = nodeSaver[curIdx][1:] // 删除第一个元素，容易出错
            if len(nodeSaver[curIdx]) == 0 {
                res = append(res, curLayer)
                curLayer = make([]int, 0) // curLayer 存储当前层的元素
                curIdx = 1 - curIdx
            }
        }
        return res
    }

</div>
