# DSA Visualizer: Plan

## Decisions
- **Stack:** React + Vite + TypeScript, plain CSS, no router (hash-based selection).
- **Controls:** play / pause / step back / step forward / scrub / speed, plus custom input and a randomize button.
- **Code panel:** pseudocode with the current line highlighted, plus a step message and variables.
- **Scope:** one visualizer per pattern. Each one lists the NeetCode / LeetCode problems that use it.
- **Deploy:** GitHub Pages through GitHub Actions on every push to `main`.
- **Commits:** one per visualizer.

## Architecture
- An algorithm is `{ id, name, category, problems, code[], input, run(input) => Frame[] }`.
- A frame is `{ line, msg, view, vars }`. Frames are precomputed, so stepping backward is free.
- There are four renderers: `array` (bars and boxes with pointers), `graph` (SVG nodes and edges, used for trees, tries, heaps, linked lists and graphs), `grid` (DP tables, matrices, hash buckets and boards) and `plot` (2D points and lines for the ML extras).

## Visualizers
| Category | Visualizers |
|---|---|
| Searching | Linear search, Binary search, Search in rotated array |
| Sorting | Bubble, Selection, Insertion, Merge, Quick, Heap, Counting |
| Arrays & Hashing | Hash map (Two Sum), Prefix sum, Kadane |
| Two Pointers | Two Sum II, Container with most water, Valid palindrome |
| Sliding Window | Fixed window max sum, Longest substring without repeats |
| Stack | Valid parentheses, Monotonic stack (daily temperatures) |
| Linked List | Reverse list, Fast/slow cycle detection, Merge two sorted lists |
| Trees | BST insert/search, DFS traversals, BFS level order |
| Tries | Trie insert/search |
| Heaps | Min-heap push/pop, Top-K with a heap |
| Intervals | Merge intervals |
| Graphs | BFS, DFS, Number of islands, Topological sort, Union-find, Dijkstra, Kruskal MST, Bellman-Ford |
| Backtracking | Subsets, Permutations, N-Queens |
| Dynamic Programming | Climbing stairs, Coin change, LIS, LCS, 0/1 knapsack |
| Bit Manipulation | Single number (XOR), Counting bits |
| ML Extras | Gradient descent, K-means, KNN, Matrix multiply |
