<div>

# 排序

## 排序方法

需要掌握额外空间消耗、平均时间复杂度、最差时间复杂度，并比较不同排序算法之间的优劣。

#### 插入排序

每步将一个待排序的记录，按其关键码值的大小插入前面已经排序的文件中适当位置上，直到全部插入完为止。

insert sort，稳定的，最差O(n^2)，平均O(n^2)，最好O(n），空间O(1)

    // 简单插入排序
    func insertSort(nums []int) []int {
        for i := 1; i< len(nums); i++ {
            preIdx := i-1
            curVal := nums[i]
            for ;preIdx >= 0 && curVal < nums[preIdx]; preIdx--{
                nums[preIdx+1] = nums[preIdx]
            }
            nums[preIdx+1] = curVal
        }
        return nums
    }

注： 上述解法中num\[:i-1\]是已经排好序的部分，num\[j\]是要插入的数，需要逐个比较已经排好序部分的数，然后插入到合适的地方。（这里其实也用到的冒泡）

#### 冒泡排序

bubble sort,  稳定的，最差O(n^2)，平均O(n^2)，最好O(n^2)，空间O(1)

    // 冒泡排序
    func bubleSort(nums []int)[]int{
        for i := 0; i < len(nums) - 1; i++{
            for j := 0; j < len(nums) - i - 1; j++ {
                if nums[j] > nums[j + 1]{
                    nums[j], nums[j+1] = nums[j+1], nums[j] 
                }
            }
        }
        return nums
    }

#### 选择排序

selection sort，稳定的，最差O(n^2)，平均O(n^2)，最好O(n^2)，空间O(1)

    // 简单选择排序
    func selectSort(nums []int) []int {
        for i := 0; i < len(nums) - 1; i++ {
            minIdx := i
            for j := i+1; j < len(nums); j++ {
                if nums[minIdx] > nums[j] {
                    minIdx = j
                }
            }
            nums[i], nums[minIdx] = nums[minIdx], nums[i]
        } 
        return nums
    }

#### **<u>快速排序</u>**

先选出一个数，比该数小的放在左边，大的放在右边。

- quick sort，不稳定，最差O(n^2)，平均O(nlog2^n)，最好O(nlog2^n)，空间O(nlog2^n)

- 快速排序当n很小时，是很慢的。

- 可以有改进的方法：

  - 在递归调用的时候，当数组长度小于一定长度的时候，用插入排序来排序小数组；

  - 当数组长度小于一定长度的时候，数组基本有序，这个时候调用插入排序对全数组进行排序；这个长度在小于9的时候最好；

        // 快速排序
        func quickSort(nums []int)[]int{
        partialLast(nums,0, len(nums)-1)
        return nums
        }
        func partial(nums []int, low, high int){ // 第一个值为pivot
        if low >= high {return}
        pivot := nums[low]
        i,j := low, high
        for i<j{
          for ;i<j && nums[j]>=pivot;j--{}
          if i<j{
              nums[i] = nums[j]
              i++
          } 
          for ;i<j&&nums[i]<=pivot;i++{}
          if i<j{
              nums[j] = nums[i]
              j--
          }
        }
        nums[i] = pivot
        partial(nums, low, i-1)
        partial(nums,i+1,high)
        }
        func partialMid(nums []int, low, high int) { //中间一个值作pivot
        if low >= high {
          return
        }

        pivot := nums[(low+high)/2]
        i, j := low, high
        nums[(low+high)/2], nums[j]  = nums[j], nums[(low+high)/2]
        for i <= j {
          for ;i <= j && nums[i] < pivot;i++ {}
          for ;i <= j && nums[j] >= pivot; j-- {}
          if i < j {
              nums[i], nums[j] = nums[j], nums[i]
              i++
              j--
          }
        }
        nums[i], nums[high]  = nums[high], nums[i]
        partialMid(nums, low, i - 1)
        partialMid(nums, i + 1, high)
        }
        func partialLast(nums []int, low, high int) {// 最后一个值作为pivot
        if low >= high{
          return
        }
        pivot := nums[high]
        i,j := low, high
        for i < j{
          for ;i < j && nums[i] <= pivot; i++ {}
          if i < j {
              nums[j] = nums[i]
              j--
          }
          for ;i < j && nums[j] >= pivot; j--{}
          if i < j {
              nums[i] = nums[j]
              i++
          }
        }
        nums[i] = pivot
        partialLast(nums, low, i-1)
        partialLast(nums, i+1, high)
        }

#### shell排序

将数组分为多个子序列，每个子序列用插入排序，不稳定，最差O(n^2)，平均O(n^1.5)，最好O(n)，空间O(1)

    // 希尔排序
    func shellSort(nums []int) []int{
        for gap := len(nums) / 2; gap > 0; gap = gap / 2 {
            for i := gap; i < len(nums); i++ {
                preIdx := i - gap;
                curVal := nums[i]
                for ; preIdx >= 0 && curVal < nums[preIdx]; preIdx -= gap{
                    nums[preIdx + gap] = nums[preIdx]
                }
                nums[preIdx + gap] = curVal
            }
        }
        return nums
    }

#### 堆排序

heap_sort, 不稳定，最差O(nlog2^n)，平均O(nlog2^n)，最好O(nlog2^n)，空间O(1)，适合于外排序，处理数据集大而不适合在内存排序的情况

- 父结点的键值总是大于或等于（小于或等于）任何一个子节点的键值；
- 每个结点的左子树和右子树都是一个二叉堆（都是最大堆或最小堆）；
- 堆的存储一般是用数组存储，i结点的父节点下标(i-1)/2，左右子结点的下标为`2*i+1和2*i+2`

<!-- -->

    // 堆排序
    func heapSort(nums []int) []int {
        for i := len(nums)/2 - 1; i >= 0; i-- { // 从倒数第一个非叶子节点（父节点）开始，每次将最大值放在所有父节点上
            heaplify(nums, i, len(nums))
        }

        for i := len(nums) - 1; i > 0; i-- { // 每次将堆的最大值放在最后，重新构造新的堆
            nums[0], nums[i] = nums[i], nums[0]
            heaplify(nums, 0, i)
        }
        return nums
    }
    func heaplify(nums []int, start, end int) { // 将最大值放在start位置上
        curIdx := start
        for curIdx < end {
            left := 2 * curIdx + 1
            right := 2 * curIdx + 2
            if left < end && nums[left] > nums[curIdx] && (right >= end || nums[left] > nums[right]) {
                nums[curIdx], nums[left] = nums[left], nums[curIdx]
                curIdx = left
            } else if right < end && nums[right] > nums[curIdx] {
                nums[curIdx], nums[right] = nums[right], nums[curIdx]
                curIdx = right
            }else {
                break
            }

        }
    }

#### 归并排序

merge sort, 递归的思想，稳定，最差O(nlog2^n)，平均O(nlog2^n)，最好O(nlog2^n)，空间O(1)

![d85620247da35b84fda5daf1baae2a7d.png](evernotecid://BE224651-30A6-49A9-8AD9-C6C3F1ABBBF8/appyinxiangcom/445930/ENResource/p2778)

## 排序算法比较

| 排序方法  | 最差时间复杂度 | 平均时间复杂度 | 最好时间复杂度 | 空间复杂度 | 稳定性 |
|-----------|----------------|----------------|----------------|------------|--------|
| 插入排序  | `O(n^2)`       | `O(n^2)`       | O(n)           | O(1)       | 稳定   |
| 冒泡排序  | O(n^2)         | O(n^2)         | O(n)           | O(1)       | 稳定   |
| 选择排序  | O(n^2)         | O(n^2)         | O(n^2)         | O(1)       | 稳定   |
| 快速排序  | O(n^2)         | O(nlog2^n)     | O(nlog2^n)     | O(nlog2^n) | 不稳定 |
| 堆排序    | O(nlog2^n)     | O(nlog2^n)     | O(nlog2^n)     | O(1)       | 不稳定 |
| 归并排序  | O(nlog2^n)     | O(nlog2^n)     | O(nlog2^n)     | O(1)       | 稳定   |
| shell排序 | O(n^2)         | O(n^1.5)       | O(n)           | O(1)       | 不稳定 |
| 基排序    | O(n)           | O(n)           | O(n)           | O(n)       | 稳定   |

*注：稳定性指，如果允许输入的关键码可以重复时，如果算法不改变具有相同关键码记录的原始输入顺序，这种算法称为稳定的。*

![eb78bd56601d10f094fa790773a0fef0.png](evernotecid://BE224651-30A6-49A9-8AD9-C6C3F1ABBBF8/appyinxiangcom/445930/ENResource/p2779)

总结：

- 按平均时间性能：
  - O(n^2)的方法：插入排序、冒泡排序、选择排序；插入排序在基本有序的情况下快
  - O(nlog2^n)的方法：快速排序、堆排序、归并排序；其中快排目前被认为是最快的一种排序；后者的话，n较大时，归并更快
  - O(n)的方法：基排序
- 按空间性能：
  - O(n)的方法：归并排序、基排序
  - O(log2^n)的方法：快速排序
  - O(1)的方法：插入排序、冒泡排序、选择排序、堆排序

# 参考

- 排序算法动图图解：cnblogs.com/onepixel/p/7674659.html

</div>
