(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactSortableTree"] = factory();
	else
		root["ReactSortableTree"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getDescendantCount = getDescendantCount;
exports.getVisibleNodeCount = getVisibleNodeCount;
exports.getVisibleNodeInfoAtIndex = getVisibleNodeInfoAtIndex;
exports.walk = walk;
exports.map = map;
exports.toggleExpandedForAll = toggleExpandedForAll;
exports.changeNodeAtPath = changeNodeAtPath;
exports.removeNodeAtPath = removeNodeAtPath;
exports.removeNode = removeNode;
exports.getNodeAtPath = getNodeAtPath;
exports.addNodeUnderParent = addNodeUnderParent;
exports.insertNode = insertNode;
exports.getFlatDataFromTree = getFlatDataFromTree;
exports.getTreeFromFlatData = getTreeFromFlatData;
exports.isDescendant = isDescendant;
exports.getDepth = getDepth;
exports.find = find;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Performs a depth-first traversal over all of the node descendants,
 * incrementing currentIndex by 1 for each
 */
function getNodeDataAtTreeIndexOrNextIndex(_ref) {
  var targetIndex = _ref.targetIndex,
      node = _ref.node,
      currentIndex = _ref.currentIndex,
      getNodeKey = _ref.getNodeKey,
      _ref$path = _ref.path,
      path = _ref$path === undefined ? [] : _ref$path,
      _ref$lowerSiblingCoun = _ref.lowerSiblingCounts,
      lowerSiblingCounts = _ref$lowerSiblingCoun === undefined ? [] : _ref$lowerSiblingCoun,
      _ref$ignoreCollapsed = _ref.ignoreCollapsed,
      ignoreCollapsed = _ref$ignoreCollapsed === undefined ? true : _ref$ignoreCollapsed,
      _ref$isPseudoRoot = _ref.isPseudoRoot,
      isPseudoRoot = _ref$isPseudoRoot === undefined ? false : _ref$isPseudoRoot;

  // The pseudo-root is not considered in the path
  var selfPath = !isPseudoRoot ? [].concat(_toConsumableArray(path), [getNodeKey({ node: node, treeIndex: currentIndex })]) : [];

  // Return target node when found
  if (currentIndex === targetIndex) {
    return {
      node: node,
      lowerSiblingCounts: lowerSiblingCounts,
      path: selfPath
    };
  }

  // Add one and continue for nodes with no children or hidden children
  if (!node.children || ignoreCollapsed && node.expanded !== true) {
    return { nextIndex: currentIndex + 1 };
  }

  // Iterate over each child and their descendants and return the
  // target node if childIndex reaches the targetIndex
  var childIndex = currentIndex + 1;
  var childCount = node.children.length;
  for (var i = 0; i < childCount; i += 1) {
    var result = getNodeDataAtTreeIndexOrNextIndex({
      ignoreCollapsed: ignoreCollapsed,
      getNodeKey: getNodeKey,
      targetIndex: targetIndex,
      node: node.children[i],
      currentIndex: childIndex,
      lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [childCount - i - 1]),
      path: selfPath
    });

    if (result.node) {
      return result;
    }

    childIndex = result.nextIndex;
  }

  // If the target node is not found, return the farthest traversed index
  return { nextIndex: childIndex };
}

function getDescendantCount(_ref2) {
  var node = _ref2.node,
      _ref2$ignoreCollapsed = _ref2.ignoreCollapsed,
      ignoreCollapsed = _ref2$ignoreCollapsed === undefined ? true : _ref2$ignoreCollapsed;

  return getNodeDataAtTreeIndexOrNextIndex({
    getNodeKey: function getNodeKey() {},
    ignoreCollapsed: ignoreCollapsed,
    node: node,
    currentIndex: 0,
    targetIndex: -1
  }).nextIndex - 1;
}

/**
 * Walk all descendants of the given node, depth-first
 *
 * @param {Object} args - Function parameters
 * @param {function} args.callback - Function to call on each node
 * @param {function} args.getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean} args.ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} args.isPseudoRoot - If true, this node has no real data, and only serves
 *                                        as the parent of all the nodes in the tree
 * @param {Object} args.node - A tree node
 * @param {Object=} args.parentNode - The parent node of `node`
 * @param {number} args.currentIndex - The treeIndex of `node`
 * @param {number[]|string[]} args.path - Array of keys leading up to node to be changed
 * @param {number[]} args.lowerSiblingCounts - An array containing the count of siblings beneath the
 *                                             previous nodes in this path
 *
 * @return {number|false} nextIndex - Index of the next sibling of `node`,
 *                                    or false if the walk should be terminated
 */
function walkDescendants(_ref3) {
  var callback = _ref3.callback,
      getNodeKey = _ref3.getNodeKey,
      ignoreCollapsed = _ref3.ignoreCollapsed,
      _ref3$isPseudoRoot = _ref3.isPseudoRoot,
      isPseudoRoot = _ref3$isPseudoRoot === undefined ? false : _ref3$isPseudoRoot,
      node = _ref3.node,
      _ref3$parentNode = _ref3.parentNode,
      parentNode = _ref3$parentNode === undefined ? null : _ref3$parentNode,
      currentIndex = _ref3.currentIndex,
      _ref3$path = _ref3.path,
      path = _ref3$path === undefined ? [] : _ref3$path,
      _ref3$lowerSiblingCou = _ref3.lowerSiblingCounts,
      lowerSiblingCounts = _ref3$lowerSiblingCou === undefined ? [] : _ref3$lowerSiblingCou;

  // The pseudo-root is not considered in the path
  var selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [getNodeKey({ node: node, treeIndex: currentIndex })]);
  var selfInfo = isPseudoRoot ? null : {
    node: node,
    parentNode: parentNode,
    path: selfPath,
    lowerSiblingCounts: lowerSiblingCounts,
    treeIndex: currentIndex
  };

  if (!isPseudoRoot) {
    var callbackResult = callback(selfInfo);

    // Cut walk short if the callback returned false
    if (callbackResult === false) {
      return false;
    }
  }

  // Return self on nodes with no children or hidden children
  if (!node.children || node.expanded !== true && ignoreCollapsed && !isPseudoRoot) {
    return currentIndex;
  }

  // Get all descendants
  var childIndex = currentIndex;
  var childCount = node.children.length;
  if (typeof node.children !== 'function') {
    for (var i = 0; i < childCount; i += 1) {
      childIndex = walkDescendants({
        callback: callback,
        getNodeKey: getNodeKey,
        ignoreCollapsed: ignoreCollapsed,
        node: node.children[i],
        parentNode: isPseudoRoot ? null : node,
        currentIndex: childIndex + 1,
        lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [childCount - i - 1]),
        path: selfPath
      });

      // Cut walk short if the callback returned false
      if (childIndex === false) {
        return false;
      }
    }
  }

  return childIndex;
}

/**
 * Perform a change on the given node and all its descendants, traversing the tree depth-first
 *
 * @param {Object} args - Function parameters
 * @param {function} args.callback - Function to call on each node
 * @param {function} args.getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean} args.ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} args.isPseudoRoot - If true, this node has no real data, and only serves
 *                                        as the parent of all the nodes in the tree
 * @param {Object} args.node - A tree node
 * @param {Object=} args.parentNode - The parent node of `node`
 * @param {number} args.currentIndex - The treeIndex of `node`
 * @param {number[]|string[]} args.path - Array of keys leading up to node to be changed
 * @param {number[]} args.lowerSiblingCounts - An array containing the count of siblings beneath the
 *                                             previous nodes in this path
 *
 * @return {number|false} nextIndex - Index of the next sibling of `node`,
 *                                    or false if the walk should be terminated
 */
function mapDescendants(_ref4) {
  var callback = _ref4.callback,
      getNodeKey = _ref4.getNodeKey,
      ignoreCollapsed = _ref4.ignoreCollapsed,
      _ref4$isPseudoRoot = _ref4.isPseudoRoot,
      isPseudoRoot = _ref4$isPseudoRoot === undefined ? false : _ref4$isPseudoRoot,
      node = _ref4.node,
      _ref4$parentNode = _ref4.parentNode,
      parentNode = _ref4$parentNode === undefined ? null : _ref4$parentNode,
      currentIndex = _ref4.currentIndex,
      _ref4$path = _ref4.path,
      path = _ref4$path === undefined ? [] : _ref4$path,
      _ref4$lowerSiblingCou = _ref4.lowerSiblingCounts,
      lowerSiblingCounts = _ref4$lowerSiblingCou === undefined ? [] : _ref4$lowerSiblingCou;

  var nextNode = _extends({}, node);

  // The pseudo-root is not considered in the path
  var selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [getNodeKey({ node: nextNode, treeIndex: currentIndex })]);
  var selfInfo = {
    node: nextNode,
    parentNode: parentNode,
    path: selfPath,
    lowerSiblingCounts: lowerSiblingCounts,
    treeIndex: currentIndex
  };

  // Return self on nodes with no children or hidden children
  if (!nextNode.children || nextNode.expanded !== true && ignoreCollapsed && !isPseudoRoot) {
    return {
      treeIndex: currentIndex,
      node: callback(selfInfo)
    };
  }

  // Get all descendants
  var childIndex = currentIndex;
  var childCount = nextNode.children.length;
  if (typeof nextNode.children !== 'function') {
    nextNode.children = nextNode.children.map(function (child, i) {
      var mapResult = mapDescendants({
        callback: callback,
        getNodeKey: getNodeKey,
        ignoreCollapsed: ignoreCollapsed,
        node: child,
        parentNode: isPseudoRoot ? null : nextNode,
        currentIndex: childIndex + 1,
        lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [childCount - i - 1]),
        path: selfPath
      });
      childIndex = mapResult.treeIndex;

      return mapResult.node;
    });
  }

  return {
    node: callback(selfInfo),
    treeIndex: childIndex
  };
}

/**
 * Count all the visible (expanded) descendants in the tree data.
 *
 * @param {!Object[]} treeData - Tree data
 *
 * @return {number} count
 */
function getVisibleNodeCount(_ref5) {
  var treeData = _ref5.treeData;

  var traverse = function traverse(node) {
    if (!node.children || node.expanded !== true || typeof node.children === 'function') {
      return 1;
    }

    return 1 + node.children.reduce(function (total, currentNode) {
      return total + traverse(currentNode);
    }, 0);
  };

  return treeData.reduce(function (total, currentNode) {
    return total + traverse(currentNode);
  }, 0);
}

/**
 * Get the <targetIndex>th visible node in the tree data.
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!number} targetIndex - The index of the node to search for
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {{
 *      node: Object,
 *      path: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }|null} node - The node at targetIndex, or null if not found
 */
function getVisibleNodeInfoAtIndex(_ref6) {
  var treeData = _ref6.treeData,
      targetIndex = _ref6.index,
      getNodeKey = _ref6.getNodeKey;

  if (!treeData || treeData.length < 1) {
    return null;
  }

  // Call the tree traversal with a pseudo-root node
  var result = getNodeDataAtTreeIndexOrNextIndex({
    targetIndex: targetIndex,
    getNodeKey: getNodeKey,
    node: {
      children: treeData,
      expanded: true
    },
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: [],
    isPseudoRoot: true
  });

  if (result.node) {
    return result;
  }

  return null;
}

/**
 * Walk descendants depth-first and call a callback on each
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {function} callback - Function to call on each node
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return void
 */
function walk(_ref7) {
  var treeData = _ref7.treeData,
      getNodeKey = _ref7.getNodeKey,
      callback = _ref7.callback,
      _ref7$ignoreCollapsed = _ref7.ignoreCollapsed,
      ignoreCollapsed = _ref7$ignoreCollapsed === undefined ? true : _ref7$ignoreCollapsed;

  if (!treeData || treeData.length < 1) {
    return;
  }

  walkDescendants({
    callback: callback,
    getNodeKey: getNodeKey,
    ignoreCollapsed: ignoreCollapsed,
    isPseudoRoot: true,
    node: { children: treeData },
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: []
  });
}

/**
 * Perform a depth-first transversal of the descendants and
 *  make a change to every node in the tree
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {function} callback - Function to call on each node
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object[]} changedTreeData - The changed tree data
 */
function map(_ref8) {
  var treeData = _ref8.treeData,
      getNodeKey = _ref8.getNodeKey,
      callback = _ref8.callback,
      _ref8$ignoreCollapsed = _ref8.ignoreCollapsed,
      ignoreCollapsed = _ref8$ignoreCollapsed === undefined ? true : _ref8$ignoreCollapsed;

  if (!treeData || treeData.length < 1) {
    return [];
  }

  return mapDescendants({
    callback: callback,
    getNodeKey: getNodeKey,
    ignoreCollapsed: ignoreCollapsed,
    isPseudoRoot: true,
    node: { children: treeData },
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: []
  }).node.children;
}

/**
 * Expand or close every node in the tree
 *
 * @param {!Object[]} treeData - Tree data
 * @param {?boolean} expanded - Whether the node is expanded or not
 *
 * @return {Object[]} changedTreeData - The changed tree data
 */
function toggleExpandedForAll(_ref9) {
  var treeData = _ref9.treeData,
      _ref9$expanded = _ref9.expanded,
      expanded = _ref9$expanded === undefined ? true : _ref9$expanded;

  return map({
    treeData: treeData,
    callback: function callback(_ref10) {
      var node = _ref10.node;
      return _extends({}, node, { expanded: expanded });
    },
    getNodeKey: function getNodeKey(_ref11) {
      var treeIndex = _ref11.treeIndex;
      return treeIndex;
    },
    ignoreCollapsed: false
  });
}

/**
 * Replaces node at path with object, or callback-defined object
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be changed
 * @param {function|any} newNode - Node to replace the node at the path with, or a function producing the new node
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object[]} changedTreeData - The changed tree data
 */
function changeNodeAtPath(_ref12) {
  var treeData = _ref12.treeData,
      path = _ref12.path,
      newNode = _ref12.newNode,
      getNodeKey = _ref12.getNodeKey,
      _ref12$ignoreCollapse = _ref12.ignoreCollapsed,
      ignoreCollapsed = _ref12$ignoreCollapse === undefined ? true : _ref12$ignoreCollapse;

  var RESULT_MISS = 'RESULT_MISS';
  var traverse = function traverse(_ref13) {
    var _ref13$isPseudoRoot = _ref13.isPseudoRoot,
        isPseudoRoot = _ref13$isPseudoRoot === undefined ? false : _ref13$isPseudoRoot,
        node = _ref13.node,
        currentTreeIndex = _ref13.currentTreeIndex,
        pathIndex = _ref13.pathIndex;

    if (!isPseudoRoot && getNodeKey({ node: node, treeIndex: currentTreeIndex }) !== path[pathIndex]) {
      return RESULT_MISS;
    }

    if (pathIndex >= path.length - 1) {
      // If this is the final location in the path, return its changed form
      return typeof newNode === 'function' ? newNode({ node: node, treeIndex: currentTreeIndex }) : newNode;
    } else if (!node.children) {
      // If this node is part of the path, but has no children, return the unchanged node
      throw new Error('Path referenced children of node with no children.');
    }

    var nextTreeIndex = currentTreeIndex + 1;
    for (var i = 0; i < node.children.length; i += 1) {
      var _result = traverse({
        node: node.children[i],
        currentTreeIndex: nextTreeIndex,
        pathIndex: pathIndex + 1
      });

      // If the result went down the correct path
      if (_result !== RESULT_MISS) {
        if (_result) {
          // If the result was truthy (in this case, an object),
          //  pass it to the next level of recursion up
          return _extends({}, node, {
            children: [].concat(_toConsumableArray(node.children.slice(0, i)), [_result], _toConsumableArray(node.children.slice(i + 1)))
          });
        }
        // If the result was falsy (returned from the newNode function), then
        //  delete the node from the array.
        return _extends({}, node, {
          children: [].concat(_toConsumableArray(node.children.slice(0, i)), _toConsumableArray(node.children.slice(i + 1)))
        });
      }

      nextTreeIndex += 1 + getDescendantCount({ node: node.children[i], ignoreCollapsed: ignoreCollapsed });
    }

    return RESULT_MISS;
  };

  // Use a pseudo-root node in the beginning traversal
  var result = traverse({
    node: { children: treeData },
    currentTreeIndex: -1,
    pathIndex: -1,
    isPseudoRoot: true
  });

  if (result === RESULT_MISS) {
    throw new Error('No node found at the given path.');
  }

  return result.children;
}

/**
 * Removes the node at the specified path and returns the resulting treeData.
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object[]} changedTreeData - The tree data with the node removed
 */
function removeNodeAtPath(_ref14) {
  var treeData = _ref14.treeData,
      path = _ref14.path,
      getNodeKey = _ref14.getNodeKey,
      _ref14$ignoreCollapse = _ref14.ignoreCollapsed,
      ignoreCollapsed = _ref14$ignoreCollapse === undefined ? true : _ref14$ignoreCollapse;

  return changeNodeAtPath({
    treeData: treeData,
    path: path,
    getNodeKey: getNodeKey,
    ignoreCollapsed: ignoreCollapsed,
    newNode: null // Delete the node
  });
}

/**
 * Removes the node at the specified path and returns the resulting treeData.
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object} result
 * @return {Object[]} result.treeData - The tree data with the node removed
 * @return {Object} result.node - The node that was removed
 * @return {number} result.treeIndex - The previous treeIndex of the removed node
 */
function removeNode(_ref15) {
  var treeData = _ref15.treeData,
      path = _ref15.path,
      getNodeKey = _ref15.getNodeKey,
      _ref15$ignoreCollapse = _ref15.ignoreCollapsed,
      ignoreCollapsed = _ref15$ignoreCollapse === undefined ? true : _ref15$ignoreCollapse;

  var removedNode = null;
  var removedTreeIndex = null;
  var nextTreeData = changeNodeAtPath({
    treeData: treeData,
    path: path,
    getNodeKey: getNodeKey,
    ignoreCollapsed: ignoreCollapsed,
    newNode: function newNode(_ref16) {
      var node = _ref16.node,
          treeIndex = _ref16.treeIndex;

      // Store the target node and delete it from the tree
      removedNode = node;
      removedTreeIndex = treeIndex;

      return null;
    }
  });

  return {
    treeData: nextTreeData,
    node: removedNode,
    treeIndex: removedTreeIndex
  };
}

/**
 * Gets the node at the specified path
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object|null} nodeInfo - The node info at the given path, or null if not found
 */
function getNodeAtPath(_ref17) {
  var treeData = _ref17.treeData,
      path = _ref17.path,
      getNodeKey = _ref17.getNodeKey,
      _ref17$ignoreCollapse = _ref17.ignoreCollapsed,
      ignoreCollapsed = _ref17$ignoreCollapse === undefined ? true : _ref17$ignoreCollapse;

  var foundNodeInfo = null;

  try {
    changeNodeAtPath({
      treeData: treeData,
      path: path,
      getNodeKey: getNodeKey,
      ignoreCollapsed: ignoreCollapsed,
      newNode: function newNode(_ref18) {
        var node = _ref18.node,
            treeIndex = _ref18.treeIndex;

        foundNodeInfo = { node: node, treeIndex: treeIndex };
        return node;
      }
    });
  } catch (err) {
    // Ignore the error -- the null return will be explanation enough
  }

  return foundNodeInfo;
}

/**
 * Adds the node to the specified parent and returns the resulting treeData.
 *
 * @param {!Object[]} treeData
 * @param {!Object} newNode - The node to insert
 * @param {number|string} parentKey - The key of the to-be parentNode of the node
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} expandParent - If true, expands the parentNode specified by parentPath
 *
 * @return {Object} result
 * @return {Object[]} result.treeData - The updated tree data
 * @return {number} result.treeIndex - The tree index at which the node was inserted
 */
function addNodeUnderParent(_ref19) {
  var treeData = _ref19.treeData,
      newNode = _ref19.newNode,
      _ref19$parentKey = _ref19.parentKey,
      parentKey = _ref19$parentKey === undefined ? null : _ref19$parentKey,
      getNodeKey = _ref19.getNodeKey,
      _ref19$ignoreCollapse = _ref19.ignoreCollapsed,
      ignoreCollapsed = _ref19$ignoreCollapse === undefined ? true : _ref19$ignoreCollapse,
      _ref19$expandParent = _ref19.expandParent,
      expandParent = _ref19$expandParent === undefined ? false : _ref19$expandParent;

  if (parentKey === null) {
    return {
      treeData: [].concat(_toConsumableArray(treeData || []), [newNode]),
      treeIndex: (treeData || []).length
    };
  }

  var insertedTreeIndex = null;
  var hasBeenAdded = false;
  var changedTreeData = map({
    treeData: treeData,
    getNodeKey: getNodeKey,
    ignoreCollapsed: ignoreCollapsed,
    callback: function callback(_ref20) {
      var node = _ref20.node,
          treeIndex = _ref20.treeIndex,
          path = _ref20.path;

      var key = path ? path[path.length - 1] : null;
      // Return nodes that are not the parent as-is
      if (hasBeenAdded || key !== parentKey) {
        return node;
      }
      hasBeenAdded = true;

      var parentNode = _extends({}, node);

      if (expandParent) {
        parentNode.expanded = true;
      }

      // If no children exist yet, just add the single newNode
      if (!parentNode.children) {
        insertedTreeIndex = treeIndex + 1;
        return _extends({}, parentNode, {
          children: [newNode]
        });
      }

      if (typeof parentNode.children === 'function') {
        throw new Error('Cannot add to children defined by a function');
      }

      var nextTreeIndex = treeIndex + 1;
      for (var i = 0; i < parentNode.children.length; i += 1) {
        nextTreeIndex += 1 + getDescendantCount({ node: parentNode.children[i], ignoreCollapsed: ignoreCollapsed });
      }

      insertedTreeIndex = nextTreeIndex;

      return _extends({}, parentNode, {
        children: [].concat(_toConsumableArray(parentNode.children), [newNode])
      });
    }
  });

  if (!hasBeenAdded) {
    throw new Error('No node found with the given key.');
  }

  return {
    treeData: changedTreeData,
    treeIndex: insertedTreeIndex
  };
}

function addNodeAtDepthAndIndex(_ref21) {
  var targetDepth = _ref21.targetDepth,
      minimumTreeIndex = _ref21.minimumTreeIndex,
      newNode = _ref21.newNode,
      ignoreCollapsed = _ref21.ignoreCollapsed,
      expandParent = _ref21.expandParent,
      _ref21$isPseudoRoot = _ref21.isPseudoRoot,
      isPseudoRoot = _ref21$isPseudoRoot === undefined ? false : _ref21$isPseudoRoot,
      isLastChild = _ref21.isLastChild,
      node = _ref21.node,
      currentIndex = _ref21.currentIndex,
      currentDepth = _ref21.currentDepth,
      getNodeKey = _ref21.getNodeKey,
      _ref21$path = _ref21.path,
      path = _ref21$path === undefined ? [] : _ref21$path;

  var selfPath = function selfPath(n) {
    return isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [getNodeKey({ node: n, treeIndex: currentIndex })]);
  };

  // If the current position is the only possible place to add, add it
  if (currentIndex >= minimumTreeIndex - 1 || isLastChild && !(node.children && node.children.length)) {
    if (typeof node.children === 'function') {
      throw new Error('Cannot add to children defined by a function');
    } else {
      var extraNodeProps = expandParent ? { expanded: true } : {};
      var _nextNode = _extends({}, node, extraNodeProps, {
        children: node.children ? [newNode].concat(_toConsumableArray(node.children)) : [newNode]
      });

      return {
        node: _nextNode,
        nextIndex: currentIndex + 2,
        insertedTreeIndex: currentIndex + 1,
        parentPath: selfPath(_nextNode),
        parentNode: isPseudoRoot ? null : _nextNode
      };
    }
  }

  // If this is the target depth for the insertion,
  // i.e., where the newNode can be added to the current node's children
  if (currentDepth >= targetDepth - 1) {
    // Skip over nodes with no children or hidden children
    if (!node.children || typeof node.children === 'function' || node.expanded !== true && ignoreCollapsed && !isPseudoRoot) {
      return { node: node, nextIndex: currentIndex + 1 };
    }

    // Scan over the children to see if there's a place among them that fulfills
    // the minimumTreeIndex requirement
    var _childIndex = currentIndex + 1;
    var _insertedTreeIndex = null;
    var insertIndex = null;
    for (var i = 0; i < node.children.length; i += 1) {
      // If a valid location is found, mark it as the insertion location and
      // break out of the loop
      if (_childIndex >= minimumTreeIndex) {
        _insertedTreeIndex = _childIndex;
        insertIndex = i;
        break;
      }

      // Increment the index by the child itself plus the number of descendants it has
      _childIndex += 1 + getDescendantCount({ node: node.children[i], ignoreCollapsed: ignoreCollapsed });
    }

    // If no valid indices to add the node were found
    if (insertIndex === null) {
      // If the last position in this node's children is less than the minimum index
      // and there are more children on the level of this node, return without insertion
      if (_childIndex < minimumTreeIndex && !isLastChild) {
        return { node: node, nextIndex: _childIndex };
      }

      // Use the last position in the children array to insert the newNode
      _insertedTreeIndex = _childIndex;
      insertIndex = node.children.length;
    }

    // Insert the newNode at the insertIndex
    var _nextNode2 = _extends({}, node, {
      children: [].concat(_toConsumableArray(node.children.slice(0, insertIndex)), [newNode], _toConsumableArray(node.children.slice(insertIndex)))
    });

    // Return node with successful insert result
    return {
      node: _nextNode2,
      nextIndex: _childIndex,
      insertedTreeIndex: _insertedTreeIndex,
      parentPath: selfPath(_nextNode2),
      parentNode: isPseudoRoot ? null : _nextNode2
    };
  }

  // Skip over nodes with no children or hidden children
  if (!node.children || typeof node.children === 'function' || node.expanded !== true && ignoreCollapsed && !isPseudoRoot) {
    return { node: node, nextIndex: currentIndex + 1 };
  }

  // Get all descendants
  var insertedTreeIndex = null;
  var pathFragment = null;
  var parentNode = null;
  var childIndex = currentIndex + 1;
  var newChildren = node.children;
  if (typeof newChildren !== 'function') {
    newChildren = newChildren.map(function (child, i) {
      if (insertedTreeIndex !== null) {
        return child;
      }

      var mapResult = addNodeAtDepthAndIndex({
        targetDepth: targetDepth,
        minimumTreeIndex: minimumTreeIndex,
        newNode: newNode,
        ignoreCollapsed: ignoreCollapsed,
        expandParent: expandParent,
        isLastChild: isLastChild && i === newChildren.length - 1,
        node: child,
        currentIndex: childIndex,
        currentDepth: currentDepth + 1,
        getNodeKey: getNodeKey,
        path: [] // Cannot determine the parent path until the children have been processed
      });

      if ('insertedTreeIndex' in mapResult) {
        insertedTreeIndex = mapResult.insertedTreeIndex;
        parentNode = mapResult.parentNode;
        pathFragment = mapResult.parentPath;
      }

      childIndex = mapResult.nextIndex;

      return mapResult.node;
    });
  }

  var nextNode = _extends({}, node, { children: newChildren });
  var result = {
    node: nextNode,
    nextIndex: childIndex
  };

  if (insertedTreeIndex !== null) {
    result.insertedTreeIndex = insertedTreeIndex;
    result.parentPath = [].concat(_toConsumableArray(selfPath(nextNode)), _toConsumableArray(pathFragment));
    result.parentNode = parentNode;
  }

  return result;
}

/**
 * Insert a node into the tree at the given depth, after the minimum index
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!number} depth - The depth to insert the node at (the first level of the array being depth 0)
 * @param {!number} minimumTreeIndex - The lowest possible treeIndex to insert the node at
 * @param {!Object} newNode - The node to insert into the tree
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} expandParent - If true, expands the parent of the inserted node
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 *
 * @return {Object} result
 * @return {Object[]} result.treeData - The tree data with the node added
 * @return {number} result.treeIndex - The tree index at which the node was inserted
 * @return {number[]|string[]} result.path - Array of keys leading to the node location after insertion
 * @return {Object} result.parentNode - The parent node of the inserted node
 */
function insertNode(_ref22) {
  var treeData = _ref22.treeData,
      targetDepth = _ref22.depth,
      minimumTreeIndex = _ref22.minimumTreeIndex,
      newNode = _ref22.newNode,
      _ref22$getNodeKey = _ref22.getNodeKey,
      getNodeKey = _ref22$getNodeKey === undefined ? function () {} : _ref22$getNodeKey,
      _ref22$ignoreCollapse = _ref22.ignoreCollapsed,
      ignoreCollapsed = _ref22$ignoreCollapse === undefined ? true : _ref22$ignoreCollapse,
      _ref22$expandParent = _ref22.expandParent,
      expandParent = _ref22$expandParent === undefined ? false : _ref22$expandParent;

  if (!treeData && targetDepth === 0) {
    return {
      treeData: [newNode],
      treeIndex: 0,
      path: [getNodeKey({ node: newNode, treeIndex: 0 })],
      parentNode: null
    };
  }

  var insertResult = addNodeAtDepthAndIndex({
    targetDepth: targetDepth,
    minimumTreeIndex: minimumTreeIndex,
    newNode: newNode,
    ignoreCollapsed: ignoreCollapsed,
    expandParent: expandParent,
    getNodeKey: getNodeKey,
    isPseudoRoot: true,
    isLastChild: true,
    node: { children: treeData },
    currentIndex: -1,
    currentDepth: -1
  });

  if (!('insertedTreeIndex' in insertResult)) {
    throw new Error('No suitable position found to insert.');
  }

  var treeIndex = insertResult.insertedTreeIndex;
  return {
    treeData: insertResult.node.children,
    treeIndex: treeIndex,
    path: [].concat(_toConsumableArray(insertResult.parentPath), [getNodeKey({ node: newNode, treeIndex: treeIndex })]),
    parentNode: insertResult.parentNode
  };
}

/**
 * Get tree data flattened.
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {{
 *      node: Object,
 *      path: []string|[]number,
 *      lowerSiblingCounts: []number
 *  }}[] nodes - The node array
 */
function getFlatDataFromTree(_ref23) {
  var treeData = _ref23.treeData,
      getNodeKey = _ref23.getNodeKey,
      _ref23$ignoreCollapse = _ref23.ignoreCollapsed,
      ignoreCollapsed = _ref23$ignoreCollapse === undefined ? true : _ref23$ignoreCollapse;

  if (!treeData || treeData.length < 1) {
    return [];
  }

  var flattened = [];
  walk({
    treeData: treeData,
    getNodeKey: getNodeKey,
    ignoreCollapsed: ignoreCollapsed,
    callback: function callback(nodeInfo) {
      flattened.push(nodeInfo);
    }
  });

  return flattened;
}

/**
 * Generate a tree structure from flat data.
 *
 * @param {!Object[]} flatData
 * @param {!function=} getKey - Function to get the key from the nodeData
 * @param {!function=} getParentKey - Function to get the parent key from the nodeData
 * @param {string|number=} rootKey - The value returned by `getParentKey` that corresponds to the root node.
 *                                  For example, if your nodes have id 1-99, you might use rootKey = 0
 *
 * @return {Object[]} treeData - The flat data represented as a tree
 */
function getTreeFromFlatData(_ref24) {
  var flatData = _ref24.flatData,
      _ref24$getKey = _ref24.getKey,
      getKey = _ref24$getKey === undefined ? function (node) {
    return node.id;
  } : _ref24$getKey,
      _ref24$getParentKey = _ref24.getParentKey,
      getParentKey = _ref24$getParentKey === undefined ? function (node) {
    return node.parentId;
  } : _ref24$getParentKey,
      _ref24$rootKey = _ref24.rootKey,
      rootKey = _ref24$rootKey === undefined ? '0' : _ref24$rootKey;

  if (!flatData) {
    return [];
  }

  var childrenToParents = {};
  flatData.forEach(function (child) {
    var parentKey = getParentKey(child);

    if (parentKey in childrenToParents) {
      childrenToParents[parentKey].push(child);
    } else {
      childrenToParents[parentKey] = [child];
    }
  });

  if (!(rootKey in childrenToParents)) {
    return [];
  }

  var trav = function trav(parent) {
    var parentKey = getKey(parent);
    if (parentKey in childrenToParents) {
      return _extends({}, parent, {
        children: childrenToParents[parentKey].map(function (child) {
          return trav(child);
        })
      });
    }

    return _extends({}, parent);
  };

  return childrenToParents[rootKey].map(function (child) {
    return trav(child);
  });
}

/**
 * Check if a node is a descendant of another node.
 *
 * @param {!Object} older - Potential ancestor of younger node
 * @param {!Object} younger - Potential descendant of older node
 *
 * @return {boolean}
 */
function isDescendant(older, younger) {
  return !!older.children && typeof older.children !== 'function' && older.children.some(function (child) {
    return child === younger || isDescendant(child, younger);
  });
}

/**
 * Get the maximum depth of the children (the depth of the root node is 0).
 *
 * @param {!Object} node - Node in the tree
 * @param {?number} depth - The current depth
 *
 * @return {number} maxDepth - The deepest depth in the tree
 */
function getDepth(node) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!node.children) {
    return depth;
  }

  if (typeof node.children === 'function') {
    return depth + 1;
  }

  return node.children.reduce(function (deepest, child) {
    return Math.max(deepest, getDepth(child, depth + 1));
  }, depth);
}

/**
 * Find nodes matching a search query in the tree,
 *
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {!Object[]} treeData - Tree data
 * @param {?string|number} searchQuery - Function returning a boolean to indicate whether the node is a match or not
 * @param {!function} searchMethod - Function returning a boolean to indicate whether the node is a match or not
 * @param {?number} searchFocusOffset - The offset of the match to focus on
 *                                      (e.g., 0 focuses on the first match, 1 on the second)
 * @param {boolean=} expandAllMatchPaths - If true, expands the paths to any matched node
 * @param {boolean=} expandFocusMatchPaths - If true, expands the path to the focused node
 *
 * @return {Object[]} matches - An array of objects containing the matching `node`s, their `path`s and `treeIndex`s
 * @return {Object[]} treeData - The original tree data with all relevant nodes expanded.
 *                               If expandAllMatchPaths and expandFocusMatchPaths are both false,
 *                               it will be the same as the original tree data.
 */
function find(_ref25) {
  var getNodeKey = _ref25.getNodeKey,
      treeData = _ref25.treeData,
      searchQuery = _ref25.searchQuery,
      searchMethod = _ref25.searchMethod,
      searchFocusOffset = _ref25.searchFocusOffset,
      _ref25$expandAllMatch = _ref25.expandAllMatchPaths,
      expandAllMatchPaths = _ref25$expandAllMatch === undefined ? false : _ref25$expandAllMatch,
      _ref25$expandFocusMat = _ref25.expandFocusMatchPaths,
      expandFocusMatchPaths = _ref25$expandFocusMat === undefined ? true : _ref25$expandFocusMat;

  var matchCount = 0;
  var trav = function trav(_ref26) {
    var _ref26$isPseudoRoot = _ref26.isPseudoRoot,
        isPseudoRoot = _ref26$isPseudoRoot === undefined ? false : _ref26$isPseudoRoot,
        node = _ref26.node,
        currentIndex = _ref26.currentIndex,
        _ref26$path = _ref26.path,
        path = _ref26$path === undefined ? [] : _ref26$path;

    var matches = [];
    var isSelfMatch = false;
    var hasFocusMatch = false;
    // The pseudo-root is not considered in the path
    var selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [getNodeKey({ node: node, treeIndex: currentIndex })]);
    var extraInfo = isPseudoRoot ? null : {
      path: selfPath,
      treeIndex: currentIndex
    };

    // Nodes with with children that aren't lazy
    var hasChildren = node.children && typeof node.children !== 'function' && node.children.length > 0;

    // Examine the current node to see if it is a match
    if (!isPseudoRoot && searchMethod(_extends({}, extraInfo, { node: node, searchQuery: searchQuery }))) {
      if (matchCount === searchFocusOffset) {
        hasFocusMatch = true;
      }

      // Keep track of the number of matching nodes, so we know when the searchFocusOffset
      //  is reached
      matchCount += 1;

      // We cannot add this node to the matches right away, as it may be changed
      //  during the search of the descendants. The entire node is used in
      //  comparisons between nodes inside the `matches` and `treeData` results
      //  of this method (`find`)
      isSelfMatch = true;
    }

    var childIndex = currentIndex;
    var newNode = _extends({}, node);
    if (hasChildren) {
      // Get all descendants
      newNode.children = newNode.children.map(function (child) {
        var mapResult = trav({
          node: child,
          currentIndex: childIndex + 1,
          path: selfPath
        });

        // Ignore hidden nodes by only advancing the index counter to the returned treeIndex
        // if the child is expanded.
        //
        // The child could have been expanded from the start,
        // or expanded due to a matching node being found in its descendants
        if (mapResult.node.expanded) {
          childIndex = mapResult.treeIndex;
        } else {
          childIndex += 1;
        }

        if (mapResult.matches.length > 0 || mapResult.hasFocusMatch) {
          matches = [].concat(_toConsumableArray(matches), _toConsumableArray(mapResult.matches));
          if (mapResult.hasFocusMatch) {
            hasFocusMatch = true;
          }

          // Expand the current node if it has descendants matching the search
          // and the settings are set to do so.
          if (expandAllMatchPaths && mapResult.matches.length > 0 || (expandAllMatchPaths || expandFocusMatchPaths) && mapResult.hasFocusMatch) {
            newNode.expanded = true;
          }
        }

        return mapResult.node;
      });
    }

    // Cannot assign a treeIndex to hidden nodes
    if (!isPseudoRoot && !newNode.expanded) {
      matches = matches.map(function (match) {
        return _extends({}, match, {
          treeIndex: null
        });
      });
    }

    // Add this node to the matches if it fits the search criteria.
    // This is performed at the last minute so newNode can be sent in its final form.
    if (isSelfMatch) {
      matches = [_extends({}, extraInfo, { node: newNode })].concat(_toConsumableArray(matches));
    }

    return {
      node: matches.length > 0 ? newNode : node,
      matches: matches,
      hasFocusMatch: hasFocusMatch,
      treeIndex: childIndex
    };
  };

  var result = trav({
    node: { children: treeData },
    isPseudoRoot: true,
    currentIndex: -1
  });

  return {
    matches: result.matches,
    treeData: result.node.children
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = classnames;
// very simple className utility for creating a classname string...
// Falsy arguments are ignored:
//
// const active = true
// const className = classnames(
//    "class1",
//    !active && "class2",
//    active && "class3"
// ); // returns -> class1 class3";
//
function classnames() {
  for (var _len = arguments.length, classes = Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }

  // Use Boolean constructor as a filter callback
  // Allows for loose type truthy/falsey checks
  // Boolean("") === false;
  // Boolean(false) === false;
  // Boolean(undefined) === false;
  // Boolean(null) === false;
  // Boolean(0) === false;
  // Boolean("classname") === true;
  return classes.filter(Boolean).join(' ');
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.defaultGetNodeKey = defaultGetNodeKey;
exports.defaultSearchMethod = defaultSearchMethod;
function defaultGetNodeKey(_ref) {
  var treeIndex = _ref.treeIndex;

  return treeIndex;
}

// Cheap hack to get the text of a react object
function getReactElementText(parent) {
  if (typeof parent === 'string') {
    return parent;
  }

  if ((typeof parent === 'undefined' ? 'undefined' : _typeof(parent)) !== 'object' || !parent.props || !parent.props.children || typeof parent.props.children !== 'string' && _typeof(parent.props.children) !== 'object') {
    return '';
  }

  if (typeof parent.props.children === 'string') {
    return parent.props.children;
  }

  return parent.props.children.map(function (child) {
    return getReactElementText(child);
  }).join('');
}

// Search for a query string inside a node property
function stringSearch(key, searchQuery, node, path, treeIndex) {
  if (typeof node[key] === 'function') {
    // Search within text after calling its function to generate the text
    return String(node[key]({ node: node, path: path, treeIndex: treeIndex })).indexOf(searchQuery) > -1;
  } else if (_typeof(node[key]) === 'object') {
    // Search within text inside react elements
    return getReactElementText(node[key]).indexOf(searchQuery) > -1;
  }

  // Search within string
  return node[key] && String(node[key]).indexOf(searchQuery) > -1;
}

function defaultSearchMethod(_ref2) {
  var node = _ref2.node,
      path = _ref2.path,
      treeIndex = _ref2.treeIndex,
      searchQuery = _ref2.searchQuery;

  return stringSearch('title', searchQuery, node, path, treeIndex) || stringSearch('subtitle', searchQuery, node, path, treeIndex);
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoizedGetDescendantCount = exports.memoizedGetFlatDataFromTree = exports.memoizedInsertNode = undefined;

var _treeDataUtils = __webpack_require__(0);

var memoize = function memoize(f) {
  var savedArgsArray = [];
  var savedKeysArray = [];
  var savedResult = null;

  return function (args) {
    var keysArray = Object.keys(args).sort();
    var argsArray = keysArray.map(function (key) {
      return args[key];
    });

    // If the arguments for the last insert operation are different than this time,
    // recalculate the result
    if (argsArray.length !== savedArgsArray.length || argsArray.some(function (arg, index) {
      return arg !== savedArgsArray[index];
    }) || keysArray.some(function (key, index) {
      return key !== savedKeysArray[index];
    })) {
      savedArgsArray = argsArray;
      savedKeysArray = keysArray;
      savedResult = f(args);
    }

    return savedResult;
  };
};

var memoizedInsertNode = exports.memoizedInsertNode = memoize(_treeDataUtils.insertNode);
var memoizedGetFlatDataFromTree = exports.memoizedGetFlatDataFromTree = memoize(_treeDataUtils.getFlatDataFromTree);
var memoizedGetDescendantCount = exports.memoizedGetDescendantCount = memoize(_treeDataUtils.getDescendantCount);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableTreeWithoutDndContext = undefined;

var _defaultHandlers = __webpack_require__(4);

Object.keys(_defaultHandlers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _defaultHandlers[key];
    }
  });
});

var _treeDataUtils = __webpack_require__(0);

Object.keys(_treeDataUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _treeDataUtils[key];
    }
  });
});

var _reactSortableTree = __webpack_require__(7);

var _reactSortableTree2 = _interopRequireDefault(_reactSortableTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _reactSortableTree2.default;

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186

exports.SortableTreeWithoutDndContext = _reactSortableTree.SortableTreeWithoutDndContext;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableTreeWithoutDndContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactVirtualized = __webpack_require__(8);

var _lodash = __webpack_require__(9);

var _lodash2 = _interopRequireDefault(_lodash);

var _reactDndScrollzone = __webpack_require__(10);

var _reactDndScrollzone2 = _interopRequireDefault(_reactDndScrollzone);

__webpack_require__(11);

var _treeNode = __webpack_require__(12);

var _treeNode2 = _interopRequireDefault(_treeNode);

var _nodeRendererDefault = __webpack_require__(14);

var _nodeRendererDefault2 = _interopRequireDefault(_nodeRendererDefault);

var _treePlaceholder = __webpack_require__(16);

var _treePlaceholder2 = _interopRequireDefault(_treePlaceholder);

var _placeholderRendererDefault = __webpack_require__(17);

var _placeholderRendererDefault2 = _interopRequireDefault(_placeholderRendererDefault);

var _treeDataUtils = __webpack_require__(0);

var _memoizedTreeDataUtils = __webpack_require__(5);

var _genericUtils = __webpack_require__(19);

var _defaultHandlers = __webpack_require__(4);

var _dndManager = __webpack_require__(20);

var _dndManager2 = _interopRequireDefault(_dndManager);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

__webpack_require__(24);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var treeIdCounter = 1;

var mergeTheme = function mergeTheme(props) {
  var merged = _extends({}, props, {
    style: _extends({}, props.theme.style, props.style),
    innerStyle: _extends({}, props.theme.innerStyle, props.innerStyle),
    reactVirtualizedListProps: _extends({}, props.theme.reactVirtualizedListProps, props.reactVirtualizedListProps)
  });

  var overridableDefaults = {
    nodeContentRenderer: _nodeRendererDefault2.default,
    placeholderRenderer: _placeholderRendererDefault2.default,
    rowHeight: 62,
    scaffoldBlockPxWidth: 44,
    slideRegionSize: 100,
    treeNodeRenderer: _treeNode2.default
  };
  Object.keys(overridableDefaults).forEach(function (propKey) {
    // If prop has been specified, do not change it
    // If prop is specified in theme, use the theme setting
    // If all else fails, fall back to the default
    if (props[propKey] === null) {
      merged[propKey] = typeof props.theme[propKey] !== 'undefined' ? props.theme[propKey] : overridableDefaults[propKey];
    }
  });

  return merged;
};

var ReactSortableTree = function (_Component) {
  _inherits(ReactSortableTree, _Component);

  function ReactSortableTree(props) {
    _classCallCheck(this, ReactSortableTree);

    var _this = _possibleConstructorReturn(this, (ReactSortableTree.__proto__ || Object.getPrototypeOf(ReactSortableTree)).call(this, props));

    var _mergeTheme = mergeTheme(props),
        dndType = _mergeTheme.dndType,
        nodeContentRenderer = _mergeTheme.nodeContentRenderer,
        treeNodeRenderer = _mergeTheme.treeNodeRenderer,
        isVirtualized = _mergeTheme.isVirtualized,
        slideRegionSize = _mergeTheme.slideRegionSize;

    _this.dndManager = new _dndManager2.default(_this);

    // Wrapping classes for use with react-dnd
    _this.treeId = 'rst__' + treeIdCounter;
    treeIdCounter += 1;
    _this.dndType = dndType || _this.treeId;
    _this.nodeContentRenderer = _this.dndManager.wrapSource(nodeContentRenderer);
    _this.treePlaceholderRenderer = _this.dndManager.wrapPlaceholder(_treePlaceholder2.default);
    _this.treeNodeRenderer = _this.dndManager.wrapTarget(treeNodeRenderer);

    // Prepare scroll-on-drag options for this list
    if (isVirtualized) {
      _this.scrollZoneVirtualList = (0, _reactDndScrollzone2.default)(_reactVirtualized.List);
      _this.vStrength = (0, _reactDndScrollzone.createVerticalStrength)(slideRegionSize);
      _this.hStrength = (0, _reactDndScrollzone.createHorizontalStrength)(slideRegionSize);
    }

    _this.state = {
      draggingTreeData: null,
      draggedNode: null,
      draggedMinimumTreeIndex: null,
      draggedDepth: null,
      searchMatches: [],
      searchFocusTreeIndex: null,
      dragging: false
    };

    _this.toggleChildrenVisibility = _this.toggleChildrenVisibility.bind(_this);
    _this.moveNode = _this.moveNode.bind(_this);
    _this.startDrag = _this.startDrag.bind(_this);
    _this.dragHover = _this.dragHover.bind(_this);
    _this.endDrag = _this.endDrag.bind(_this);
    _this.drop = _this.drop.bind(_this);
    _this.handleDndMonitorChange = _this.handleDndMonitorChange.bind(_this);
    return _this;
  }

  _createClass(ReactSortableTree, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadLazyChildren();
      this.search(this.props);

      // Hook into react-dnd state changes to detect when the drag ends
      // TODO: This is very brittle, so it needs to be replaced if react-dnd
      // offers a more official way to detect when a drag ends
      this.clearMonitorSubscription = this.context.dragDropManager.getMonitor().subscribeToStateChange(this.handleDndMonitorChange);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.treeData !== nextProps.treeData) {
        // Ignore updates caused by search, in order to avoid infinite looping
        if (this.ignoreOneTreeUpdate) {
          this.ignoreOneTreeUpdate = false;
        } else {
          // Reset the focused index if the tree has changed
          this.setState({ searchFocusTreeIndex: null });

          // Load any children defined by a function
          this.loadLazyChildren(nextProps);

          this.search(nextProps, false, false);
        }

        // Reset the drag state
        this.setState({
          draggingTreeData: null,
          draggedNode: null,
          draggedMinimumTreeIndex: null,
          draggedDepth: null,
          dragging: false
        });
      } else if (!(0, _lodash2.default)(this.props.searchQuery, nextProps.searchQuery)) {
        this.search(nextProps);
      } else if (this.props.searchFocusOffset !== nextProps.searchFocusOffset) {
        this.search(nextProps, true, true, true);
      }
    }

    // listen to dragging

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // if it is not the same then call the onDragStateChanged
      if (this.state.dragging !== prevState.dragging) {
        if (this.props.onDragStateChanged) {
          this.props.onDragStateChanged({
            isDragging: this.state.dragging,
            draggedNode: this.state.draggedNode
          });
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearMonitorSubscription();
    }
  }, {
    key: 'getRows',
    value: function getRows(treeData) {
      return (0, _memoizedTreeDataUtils.memoizedGetFlatDataFromTree)({
        ignoreCollapsed: true,
        getNodeKey: this.props.getNodeKey,
        treeData: treeData
      });
    }
  }, {
    key: 'handleDndMonitorChange',
    value: function handleDndMonitorChange() {
      var monitor = this.context.dragDropManager.getMonitor();
      // If the drag ends and the tree is still in a mid-drag state,
      // it means that the drag was canceled or the dragSource dropped
      // elsewhere, and we should reset the state of this tree
      if (!monitor.isDragging() && this.state.draggingTreeData) {
        this.endDrag();
      }
    }
  }, {
    key: 'toggleChildrenVisibility',
    value: function toggleChildrenVisibility(_ref) {
      var targetNode = _ref.node,
          path = _ref.path;

      var treeData = (0, _treeDataUtils.changeNodeAtPath)({
        treeData: this.props.treeData,
        path: path,
        newNode: function newNode(_ref2) {
          var node = _ref2.node;
          return _extends({}, node, { expanded: !node.expanded });
        },
        getNodeKey: this.props.getNodeKey
      });

      this.props.onChange(treeData);

      this.props.onVisibilityToggle({
        treeData: treeData,
        node: targetNode,
        expanded: !targetNode.expanded,
        path: path
      });
    }
  }, {
    key: 'moveNode',
    value: function moveNode(_ref3) {
      var node = _ref3.node,
          prevPath = _ref3.path,
          prevTreeIndex = _ref3.treeIndex,
          depth = _ref3.depth,
          minimumTreeIndex = _ref3.minimumTreeIndex;

      var _insertNode = (0, _treeDataUtils.insertNode)({
        treeData: this.state.draggingTreeData,
        newNode: node,
        depth: depth,
        minimumTreeIndex: minimumTreeIndex,
        expandParent: true,
        getNodeKey: this.props.getNodeKey
      }),
          treeData = _insertNode.treeData,
          treeIndex = _insertNode.treeIndex,
          path = _insertNode.path,
          nextParentNode = _insertNode.parentNode;

      this.props.onChange(treeData);

      this.props.onMoveNode({
        treeData: treeData,
        node: node,
        treeIndex: treeIndex,
        path: path,
        nextPath: path,
        nextTreeIndex: treeIndex,
        prevPath: prevPath,
        prevTreeIndex: prevTreeIndex,
        nextParentNode: nextParentNode
      });
    }
  }, {
    key: 'search',
    value: function search() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var seekIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var expand = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var singleSearch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var treeData = props.treeData,
          onChange = props.onChange,
          searchFinishCallback = props.searchFinishCallback,
          searchQuery = props.searchQuery,
          searchMethod = props.searchMethod,
          searchFocusOffset = props.searchFocusOffset,
          onlyExpandSearchedNodes = props.onlyExpandSearchedNodes;

      // Skip search if no conditions are specified

      if ((searchQuery === null || typeof searchQuery === 'undefined' || String(searchQuery) === '') && !searchMethod) {
        this.setState({
          searchMatches: []
        });

        if (searchFinishCallback) {
          searchFinishCallback([]);
        }

        return;
      }

      // if onlyExpandSearchedNodes collapse the tree and search

      var _find = (0, _treeDataUtils.find)({
        getNodeKey: this.props.getNodeKey,
        treeData: onlyExpandSearchedNodes ? (0, _treeDataUtils.toggleExpandedForAll)({ treeData: treeData, expanded: false }) : treeData,
        searchQuery: searchQuery,
        searchMethod: searchMethod || _defaultHandlers.defaultSearchMethod,
        searchFocusOffset: searchFocusOffset,
        expandAllMatchPaths: expand && !singleSearch,
        expandFocusMatchPaths: !!expand
      }),
          expandedTreeData = _find.treeData,
          searchMatches = _find.matches;

      // Update the tree with data leaving all paths leading to matching nodes open


      if (expand) {
        this.ignoreOneTreeUpdate = true; // Prevents infinite loop
        onChange(expandedTreeData);
      }

      if (searchFinishCallback) {
        searchFinishCallback(searchMatches);
      }

      var searchFocusTreeIndex = null;
      if (seekIndex && searchFocusOffset !== null && searchFocusOffset < searchMatches.length) {
        searchFocusTreeIndex = searchMatches[searchFocusOffset].treeIndex;
      }

      this.setState({
        searchMatches: searchMatches,
        searchFocusTreeIndex: searchFocusTreeIndex
      });
    }
  }, {
    key: 'startDrag',
    value: function startDrag(_ref4) {
      var _this2 = this;

      var path = _ref4.path;

      this.setState(function () {
        var _removeNode = (0, _treeDataUtils.removeNode)({
          treeData: _this2.props.treeData,
          path: path,
          getNodeKey: _this2.props.getNodeKey
        }),
            draggingTreeData = _removeNode.treeData,
            draggedNode = _removeNode.node,
            draggedMinimumTreeIndex = _removeNode.treeIndex;

        return {
          draggingTreeData: draggingTreeData,
          draggedNode: draggedNode,
          draggedDepth: path.length - 1,
          draggedMinimumTreeIndex: draggedMinimumTreeIndex,
          dragging: true
        };
      });
    }
  }, {
    key: 'dragHover',
    value: function dragHover(_ref5) {
      var draggedNode = _ref5.node,
          draggedDepth = _ref5.depth,
          draggedMinimumTreeIndex = _ref5.minimumTreeIndex;

      // Ignore this hover if it is at the same position as the last hover
      if (this.state.draggedDepth === draggedDepth && this.state.draggedMinimumTreeIndex === draggedMinimumTreeIndex) {
        return;
      }

      // Fall back to the tree data if something is being dragged in from
      //  an external element
      var draggingTreeData = this.state.draggingTreeData || this.props.treeData;

      var addedResult = (0, _memoizedTreeDataUtils.memoizedInsertNode)({
        treeData: draggingTreeData,
        newNode: draggedNode,
        depth: draggedDepth,
        minimumTreeIndex: draggedMinimumTreeIndex,
        expandParent: true,
        getNodeKey: this.props.getNodeKey
      });

      var rows = this.getRows(addedResult.treeData);
      var expandedParentPath = rows[addedResult.treeIndex].path;

      this.setState({
        draggedNode: draggedNode,
        draggedDepth: draggedDepth,
        draggedMinimumTreeIndex: draggedMinimumTreeIndex,
        draggingTreeData: (0, _treeDataUtils.changeNodeAtPath)({
          treeData: draggingTreeData,
          path: expandedParentPath.slice(0, -1),
          newNode: function newNode(_ref6) {
            var node = _ref6.node;
            return _extends({}, node, { expanded: true });
          },
          getNodeKey: this.props.getNodeKey
        }),
        // reset the scroll focus so it doesn't jump back
        // to a search result while dragging
        searchFocusTreeIndex: null,
        dragging: true
      });
    }
  }, {
    key: 'endDrag',
    value: function endDrag(dropResult) {
      var _this3 = this;

      var resetTree = function resetTree() {
        return _this3.setState({
          draggingTreeData: null,
          draggedNode: null,
          draggedMinimumTreeIndex: null,
          draggedDepth: null,
          dragging: false
        });
      };

      // Drop was cancelled
      if (!dropResult) {
        resetTree();
      } else if (dropResult.treeId !== this.treeId) {
        // The node was dropped in an external drop target or tree
        var node = dropResult.node,
            path = dropResult.path,
            treeIndex = dropResult.treeIndex;

        var shouldCopy = this.props.shouldCopyOnOutsideDrop;
        if (typeof shouldCopy === 'function') {
          shouldCopy = shouldCopy({
            node: node,
            prevTreeIndex: treeIndex,
            prevPath: path
          });
        }

        var treeData = this.state.draggingTreeData || this.props.treeData;

        // If copying is enabled, a drop outside leaves behind a copy in the
        //  source tree
        if (shouldCopy) {
          treeData = (0, _treeDataUtils.changeNodeAtPath)({
            treeData: this.props.treeData, // use treeData unaltered by the drag operation
            path: path,
            newNode: function newNode(_ref7) {
              var copyNode = _ref7.node;
              return _extends({}, copyNode);
            }, // create a shallow copy of the node
            getNodeKey: this.props.getNodeKey
          });
        }

        this.props.onChange(treeData);

        this.props.onMoveNode({
          treeData: treeData,
          node: node,
          treeIndex: null,
          path: null,
          nextPath: null,
          nextTreeIndex: null,
          prevPath: path,
          prevTreeIndex: treeIndex
        });
      }
    }
  }, {
    key: 'drop',
    value: function drop(dropResult) {
      this.moveNode(dropResult);
    }

    // Load any children in the tree that are given by a function

  }, {
    key: 'loadLazyChildren',
    value: function loadLazyChildren() {
      var _this4 = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      (0, _treeDataUtils.walk)({
        treeData: props.treeData,
        getNodeKey: this.props.getNodeKey,
        callback: function callback(_ref8) {
          var node = _ref8.node,
              path = _ref8.path,
              lowerSiblingCounts = _ref8.lowerSiblingCounts,
              treeIndex = _ref8.treeIndex;

          // If the node has children defined by a function, and is either expanded
          //  or set to load even before expansion, run the function.
          if (node.children && typeof node.children === 'function' && (node.expanded || props.loadCollapsedLazyChildren)) {
            // Call the children fetching function
            node.children({
              node: node,
              path: path,
              lowerSiblingCounts: lowerSiblingCounts,
              treeIndex: treeIndex,

              // Provide a helper to append the new data when it is received
              done: function done(childrenArray) {
                return _this4.props.onChange((0, _treeDataUtils.changeNodeAtPath)({
                  treeData: _this4.props.treeData,
                  path: path,
                  newNode: function newNode(_ref9) {
                    var oldNode = _ref9.node;
                    return (
                      // Only replace the old node if it's the one we set off to find children
                      //  for in the first place
                      oldNode === node ? _extends({}, oldNode, {
                        children: childrenArray
                      }) : oldNode
                    );
                  },
                  getNodeKey: _this4.props.getNodeKey
                }));
              }
            });
          }
        }
      });
    }
  }, {
    key: 'renderRow',
    value: function renderRow(_ref10, _ref11) {
      var node = _ref10.node,
          parentNode = _ref10.parentNode,
          path = _ref10.path,
          lowerSiblingCounts = _ref10.lowerSiblingCounts,
          treeIndex = _ref10.treeIndex;
      var listIndex = _ref11.listIndex,
          style = _ref11.style,
          getPrevRow = _ref11.getPrevRow,
          matchKeys = _ref11.matchKeys,
          swapFrom = _ref11.swapFrom,
          swapDepth = _ref11.swapDepth,
          swapLength = _ref11.swapLength,
          parentGrid = _ref11.parentGrid;

      var _mergeTheme2 = mergeTheme(this.props),
          canDrag = _mergeTheme2.canDrag,
          generateNodeProps = _mergeTheme2.generateNodeProps,
          scaffoldBlockPxWidth = _mergeTheme2.scaffoldBlockPxWidth,
          searchFocusOffset = _mergeTheme2.searchFocusOffset;

      var TreeNodeRenderer = this.treeNodeRenderer;
      var NodeContentRenderer = this.nodeContentRenderer;
      var nodeKey = path[path.length - 1];
      var isSearchMatch = nodeKey in matchKeys;
      var isSearchFocus = isSearchMatch && matchKeys[nodeKey] === searchFocusOffset;
      var callbackParams = {
        node: node,
        parentNode: parentNode,
        path: path,
        lowerSiblingCounts: lowerSiblingCounts,
        treeIndex: treeIndex,
        isSearchMatch: isSearchMatch,
        isSearchFocus: isSearchFocus
      };
      var nodeProps = !generateNodeProps ? {} : generateNodeProps(callbackParams);
      var rowCanDrag = typeof canDrag !== 'function' ? canDrag : canDrag(callbackParams);

      var sharedProps = {
        treeIndex: treeIndex,
        scaffoldBlockPxWidth: scaffoldBlockPxWidth,
        node: node,
        path: path,
        treeId: this.treeId
      };

      return _react2.default.createElement(
        TreeNodeRenderer,
        _extends({
          style: style,
          key: nodeKey,
          listIndex: listIndex,
          getPrevRow: getPrevRow,
          lowerSiblingCounts: lowerSiblingCounts,
          swapFrom: swapFrom,
          swapLength: swapLength,
          swapDepth: swapDepth,
          parentGrid: parentGrid
        }, sharedProps),
        _react2.default.createElement(NodeContentRenderer, _extends({
          parentNode: parentNode,
          isSearchMatch: isSearchMatch,
          isSearchFocus: isSearchFocus,
          canDrag: rowCanDrag,
          toggleChildrenVisibility: this.toggleChildrenVisibility
        }, sharedProps, nodeProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _mergeTheme3 = mergeTheme(this.props),
          style = _mergeTheme3.style,
          className = _mergeTheme3.className,
          innerStyle = _mergeTheme3.innerStyle,
          rowHeight = _mergeTheme3.rowHeight,
          isVirtualized = _mergeTheme3.isVirtualized,
          placeholderRenderer = _mergeTheme3.placeholderRenderer,
          reactVirtualizedListProps = _mergeTheme3.reactVirtualizedListProps,
          getNodeKey = _mergeTheme3.getNodeKey;

      var _state = this.state,
          searchMatches = _state.searchMatches,
          searchFocusTreeIndex = _state.searchFocusTreeIndex,
          draggedNode = _state.draggedNode,
          draggedDepth = _state.draggedDepth,
          draggedMinimumTreeIndex = _state.draggedMinimumTreeIndex;


      var treeData = this.state.draggingTreeData || this.props.treeData;

      var rows = void 0;
      var swapFrom = null;
      var swapLength = null;
      if (draggedNode && draggedMinimumTreeIndex !== null) {
        var addedResult = (0, _memoizedTreeDataUtils.memoizedInsertNode)({
          treeData: treeData,
          newNode: draggedNode,
          depth: draggedDepth,
          minimumTreeIndex: draggedMinimumTreeIndex,
          expandParent: true,
          getNodeKey: getNodeKey
        });

        var swapTo = draggedMinimumTreeIndex;
        swapFrom = addedResult.treeIndex;
        swapLength = 1 + (0, _memoizedTreeDataUtils.memoizedGetDescendantCount)({ node: draggedNode });
        rows = (0, _genericUtils.slideRows)(this.getRows(addedResult.treeData), swapFrom, swapTo, swapLength);
      } else {
        rows = this.getRows(treeData);
      }

      // Get indices for rows that match the search conditions
      var matchKeys = {};
      searchMatches.forEach(function (_ref12, i) {
        var path = _ref12.path;

        matchKeys[path[path.length - 1]] = i;
      });

      // Seek to the focused search result if there is one specified
      var scrollToInfo = searchFocusTreeIndex !== null ? { scrollToIndex: searchFocusTreeIndex } : {};

      var containerStyle = style;
      var list = void 0;
      if (rows.length < 1) {
        var Placeholder = this.treePlaceholderRenderer;
        var PlaceholderContent = placeholderRenderer;
        list = _react2.default.createElement(
          Placeholder,
          { treeId: this.treeId, drop: this.drop },
          _react2.default.createElement(PlaceholderContent, null)
        );
      } else if (isVirtualized) {
        containerStyle = _extends({ height: '100%' }, containerStyle);

        var ScrollZoneVirtualList = this.scrollZoneVirtualList;
        // Render list with react-virtualized
        list = _react2.default.createElement(
          _reactVirtualized.AutoSizer,
          null,
          function (_ref13) {
            var height = _ref13.height,
                width = _ref13.width;
            return _react2.default.createElement(ScrollZoneVirtualList, _extends({}, scrollToInfo, {
              verticalStrength: _this5.vStrength,
              horizontalStrength: _this5.hStrength,
              speed: 30,
              scrollToAlignment: 'start',
              className: 'rst__virtualScrollOverride',
              width: width,
              onScroll: function onScroll(_ref14) {
                var scrollTop = _ref14.scrollTop;

                _this5.scrollTop = scrollTop;
              },
              height: height,
              style: innerStyle,
              rowCount: rows.length,
              estimatedRowSize: typeof rowHeight !== 'function' ? rowHeight : undefined,
              rowHeight: typeof rowHeight !== 'function' ? rowHeight : function (_ref15) {
                var index = _ref15.index;
                return rowHeight({
                  index: index,
                  treeIndex: index,
                  node: rows[index].node,
                  path: rows[index].path
                });
              },
              rowRenderer: function rowRenderer(_ref16) {
                var index = _ref16.index,
                    rowStyle = _ref16.style,
                    parent = _ref16.parent;
                return _this5.renderRow(rows[index], {
                  parentGrid: parent,
                  listIndex: index,
                  style: rowStyle,
                  getPrevRow: function getPrevRow() {
                    return rows[index - 1] || null;
                  },
                  matchKeys: matchKeys,
                  swapFrom: swapFrom,
                  swapDepth: draggedDepth,
                  swapLength: swapLength
                });
              }
            }, reactVirtualizedListProps));
          }
        );
      } else {
        // Render list without react-virtualized
        list = rows.map(function (row, index) {
          return _this5.renderRow(row, {
            listIndex: index,
            style: {
              height: typeof rowHeight !== 'function' ? rowHeight : rowHeight({
                index: index,
                treeIndex: index,
                node: row.node,
                path: row.path
              })
            },
            getPrevRow: function getPrevRow() {
              return rows[index - 1] || null;
            },
            matchKeys: matchKeys,
            swapFrom: swapFrom,
            swapDepth: draggedDepth,
            swapLength: swapLength
          });
        });
      }

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('rst__tree', className),
          style: containerStyle
        },
        list
      );
    }
  }]);

  return ReactSortableTree;
}(_react.Component);

ReactSortableTree.propTypes = {
  // Tree data in the following format:
  // [{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]
  // `title` is the primary label for the node
  // `subtitle` is a secondary label for the node
  // `expanded` shows children of the node if true, or hides them if false. Defaults to false.
  // `children` is an array of child nodes belonging to the node.
  treeData: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,

  // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
  style: _propTypes2.default.shape({}),

  // Class name for the container wrapping the tree
  className: _propTypes2.default.string,

  // Style applied to the inner, scrollable container (for padding, etc.)
  innerStyle: _propTypes2.default.shape({}),

  // Used by react-virtualized
  // Either a fixed row height (number) or a function that returns the
  // height of a row given its index: `({ index: number }): number`
  rowHeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),

  // Size in px of the region near the edges that initiates scrolling on dragover
  slideRegionSize: _propTypes2.default.number,

  // Custom properties to hand to the react-virtualized list
  // https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types
  reactVirtualizedListProps: _propTypes2.default.shape({}),

  // The width of the blocks containing the lines representing the structure of the tree.
  scaffoldBlockPxWidth: _propTypes2.default.number,

  // Maximum depth nodes can be inserted at. Defaults to infinite.
  maxDepth: _propTypes2.default.number,

  // The method used to search nodes.
  // Defaults to a function that uses the `searchQuery` string to search for nodes with
  // matching `title` or `subtitle` values.
  // NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.
  searchMethod: _propTypes2.default.func,

  // Used by the `searchMethod` to highlight and scroll to matched nodes.
  // Should be a string for the default `searchMethod`, but can be anything when using a custom search.
  searchQuery: _propTypes2.default.any, // eslint-disable-line react/forbid-prop-types

  // Outline the <`searchFocusOffset`>th node and scroll to it.
  searchFocusOffset: _propTypes2.default.number,

  // Get the nodes that match the search criteria. Used for counting total matches, etc.
  searchFinishCallback: _propTypes2.default.func,

  // Generate an object with additional props to be passed to the node renderer.
  // Use this for adding buttons via the `buttons` key,
  // or additional `style` / `className` settings.
  generateNodeProps: _propTypes2.default.func,

  // Set to false to disable virtualization.
  // NOTE: Auto-scrolling while dragging, and scrolling to the `searchFocusOffset` will be disabled.
  isVirtualized: _propTypes2.default.bool,

  treeNodeRenderer: _propTypes2.default.func,

  // Override the default component for rendering nodes (but keep the scaffolding generator)
  // This is an advanced option for complete customization of the appearance.
  // It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
  nodeContentRenderer: _propTypes2.default.func,

  // Override the default component for rendering an empty tree
  // This is an advanced option for complete customization of the appearance.
  // It is best to copy the component in `placeholder-renderer-default.js` to use as a base,
  // and customize as needed.
  placeholderRenderer: _propTypes2.default.func,

  theme: _propTypes2.default.shape({
    style: _propTypes2.default.shape({}),
    innerStyle: _propTypes2.default.shape({}),
    reactVirtualizedListProps: _propTypes2.default.shape({}),
    scaffoldBlockPxWidth: _propTypes2.default.number,
    slideRegionSize: _propTypes2.default.number,
    rowHeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
    treeNodeRenderer: _propTypes2.default.func,
    nodeContentRenderer: _propTypes2.default.func,
    placeholderRenderer: _propTypes2.default.func
  }),

  // Determine the unique key used to identify each node and
  // generate the `path` array passed in callbacks.
  // By default, returns the index in the tree (omitting hidden nodes).
  getNodeKey: _propTypes2.default.func,

  // Called whenever tree data changed.
  // Just like with React input elements, you have to update your
  // own component's data to see the changes reflected.
  onChange: _propTypes2.default.func.isRequired,

  // Called after node move operation.
  onMoveNode: _propTypes2.default.func,

  // Determine whether a node can be dragged. Set to false to disable dragging on all nodes.
  canDrag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.bool]),

  // Determine whether a node can be dropped based on its path and parents'.
  canDrop: _propTypes2.default.func,

  // When true, or a callback returning true, dropping nodes to react-dnd
  // drop targets outside of this tree will not remove them from this tree
  shouldCopyOnOutsideDrop: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.bool]),

  // Called after children nodes collapsed or expanded.
  onVisibilityToggle: _propTypes2.default.func,

  dndType: _propTypes2.default.string,

  // Called to track between dropped and dragging
  onDragStateChanged: _propTypes2.default.func,

  // Specify that nodes that do not match search will be collapsed
  onlyExpandSearchedNodes: _propTypes2.default.bool
};

ReactSortableTree.defaultProps = {
  canDrag: true,
  canDrop: null,
  className: '',
  dndType: null,
  generateNodeProps: null,
  getNodeKey: _defaultHandlers.defaultGetNodeKey,
  innerStyle: {},
  isVirtualized: true,
  maxDepth: null,
  treeNodeRenderer: null,
  nodeContentRenderer: null,
  onMoveNode: function onMoveNode() {},
  onVisibilityToggle: function onVisibilityToggle() {},
  placeholderRenderer: null,
  reactVirtualizedListProps: {},
  rowHeight: null,
  scaffoldBlockPxWidth: null,
  searchFinishCallback: null,
  searchFocusOffset: null,
  searchMethod: null,
  searchQuery: null,
  shouldCopyOnOutsideDrop: false,
  slideRegionSize: null,
  style: {},
  theme: {},
  onDragStateChanged: function onDragStateChanged() {},
  onlyExpandSearchedNodes: false
};

ReactSortableTree.contextTypes = {
  dragDropManager: _propTypes2.default.shape({})
};

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
exports.SortableTreeWithoutDndContext = ReactSortableTree;
exports.default = _dndManager2.default.wrapRoot(ReactSortableTree);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("react-virtualized");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("lodash.isequal");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("react-dnd-scrollzone");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

__webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeNode = function (_Component) {
  _inherits(TreeNode, _Component);

  function TreeNode() {
    _classCallCheck(this, TreeNode);

    return _possibleConstructorReturn(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).apply(this, arguments));
  }

  _createClass(TreeNode, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          listIndex = _props.listIndex,
          swapFrom = _props.swapFrom,
          swapLength = _props.swapLength,
          swapDepth = _props.swapDepth,
          scaffoldBlockPxWidth = _props.scaffoldBlockPxWidth,
          lowerSiblingCounts = _props.lowerSiblingCounts,
          connectDropTarget = _props.connectDropTarget,
          isOver = _props.isOver,
          draggedNode = _props.draggedNode,
          canDrop = _props.canDrop,
          treeIndex = _props.treeIndex,
          treeId = _props.treeId,
          getPrevRow = _props.getPrevRow,
          node = _props.node,
          path = _props.path,
          otherProps = _objectWithoutProperties(_props, ['children', 'listIndex', 'swapFrom', 'swapLength', 'swapDepth', 'scaffoldBlockPxWidth', 'lowerSiblingCounts', 'connectDropTarget', 'isOver', 'draggedNode', 'canDrop', 'treeIndex', 'treeId', 'getPrevRow', 'node', 'path']);

      // Construct the scaffold representing the structure of the tree


      var scaffoldBlockCount = lowerSiblingCounts.length;
      var scaffold = [];
      lowerSiblingCounts.forEach(function (lowerSiblingCount, i) {
        var lineClass = '';
        if (lowerSiblingCount > 0) {
          // At this level in the tree, the nodes had sibling nodes further down

          if (listIndex === 0) {
            // Top-left corner of the tree
            // +-----+
            // |     |
            // |  +--+
            // |  |  |
            // +--+--+
            lineClass = 'rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom';
          } else if (i === scaffoldBlockCount - 1) {
            // Last scaffold block in the row, right before the row content
            // +--+--+
            // |  |  |
            // |  +--+
            // |  |  |
            // +--+--+
            lineClass = 'rst__lineHalfHorizontalRight rst__lineFullVertical';
          } else {
            // Simply connecting the line extending down to the next sibling on this level
            // +--+--+
            // |  |  |
            // |  |  |
            // |  |  |
            // +--+--+
            lineClass = 'rst__lineFullVertical';
          }
        } else if (listIndex === 0) {
          // Top-left corner of the tree, but has no siblings
          // +-----+
          // |     |
          // |  +--+
          // |     |
          // +-----+
          lineClass = 'rst__lineHalfHorizontalRight';
        } else if (i === scaffoldBlockCount - 1) {
          // The last or only node in this level of the tree
          // +--+--+
          // |  |  |
          // |  +--+
          // |     |
          // +-----+
          lineClass = 'rst__lineHalfVerticalTop rst__lineHalfHorizontalRight';
        }

        scaffold.push(_react2.default.createElement('div', {
          key: 'pre_' + (1 + i),
          style: { width: scaffoldBlockPxWidth },
          className: 'rst__lineBlock' + ' ' + lineClass
        }));

        if (treeIndex !== listIndex && i === swapDepth) {
          // This row has been shifted, and is at the depth of
          // the line pointing to the new destination
          var highlightLineClass = '';

          if (listIndex === swapFrom + swapLength - 1) {
            // This block is on the bottom (target) line
            // This block points at the target block (where the row will go when released)
            highlightLineClass = 'rst__highlightBottomLeftCorner';
          } else if (treeIndex === swapFrom) {
            // This block is on the top (source) line
            highlightLineClass = 'rst__highlightTopLeftCorner';
          } else {
            // This block is between the bottom and top
            highlightLineClass = 'rst__highlightLineVertical';
          }

          scaffold.push(_react2.default.createElement('div', {
            // eslint-disable-next-line react/no-array-index-key
            key: i,
            style: {
              width: scaffoldBlockPxWidth,
              left: scaffoldBlockPxWidth * i
            },
            className: (0, _classnames2.default)('rst__absoluteLineBlock', highlightLineClass)
          }));
        }
      });

      return connectDropTarget(_react2.default.createElement(
        'div',
        _extends({}, otherProps, { className: 'rst__node' }),
        scaffold,
        _react2.default.createElement(
          'div',
          {
            className: 'rst__nodeContent',
            style: { left: scaffoldBlockPxWidth * scaffoldBlockCount }
          },
          _react.Children.map(children, function (child) {
            return (0, _react.cloneElement)(child, {
              isOver: isOver,
              canDrop: canDrop,
              draggedNode: draggedNode
            });
          })
        )
      ));
    }
  }]);

  return TreeNode;
}(_react.Component);

TreeNode.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null
};

TreeNode.propTypes = {
  treeIndex: _propTypes2.default.number.isRequired,
  treeId: _propTypes2.default.string.isRequired,
  swapFrom: _propTypes2.default.number,
  swapDepth: _propTypes2.default.number,
  swapLength: _propTypes2.default.number,
  scaffoldBlockPxWidth: _propTypes2.default.number.isRequired,
  lowerSiblingCounts: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,

  listIndex: _propTypes2.default.number.isRequired,
  children: _propTypes2.default.node.isRequired,

  // Drop target
  connectDropTarget: _propTypes2.default.func.isRequired,
  isOver: _propTypes2.default.bool.isRequired,
  canDrop: _propTypes2.default.bool,
  draggedNode: _propTypes2.default.shape({}),

  // used in dndManager
  getPrevRow: _propTypes2.default.func.isRequired,
  node: _propTypes2.default.shape({}).isRequired,
  path: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])).isRequired
};

exports.default = TreeNode;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _treeDataUtils = __webpack_require__(0);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

__webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeRendererDefault = function (_Component) {
  _inherits(NodeRendererDefault, _Component);

  function NodeRendererDefault() {
    _classCallCheck(this, NodeRendererDefault);

    return _possibleConstructorReturn(this, (NodeRendererDefault.__proto__ || Object.getPrototypeOf(NodeRendererDefault)).apply(this, arguments));
  }

  _createClass(NodeRendererDefault, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          scaffoldBlockPxWidth = _props.scaffoldBlockPxWidth,
          toggleChildrenVisibility = _props.toggleChildrenVisibility,
          connectDragPreview = _props.connectDragPreview,
          connectDragSource = _props.connectDragSource,
          isDragging = _props.isDragging,
          canDrop = _props.canDrop,
          canDrag = _props.canDrag,
          node = _props.node,
          title = _props.title,
          subtitle = _props.subtitle,
          draggedNode = _props.draggedNode,
          path = _props.path,
          treeIndex = _props.treeIndex,
          isSearchMatch = _props.isSearchMatch,
          isSearchFocus = _props.isSearchFocus,
          buttons = _props.buttons,
          className = _props.className,
          style = _props.style,
          didDrop = _props.didDrop,
          treeId = _props.treeId,
          isOver = _props.isOver,
          parentNode = _props.parentNode,
          otherProps = _objectWithoutProperties(_props, ['scaffoldBlockPxWidth', 'toggleChildrenVisibility', 'connectDragPreview', 'connectDragSource', 'isDragging', 'canDrop', 'canDrag', 'node', 'title', 'subtitle', 'draggedNode', 'path', 'treeIndex', 'isSearchMatch', 'isSearchFocus', 'buttons', 'className', 'style', 'didDrop', 'treeId', 'isOver', 'parentNode']);

      var nodeTitle = title || node.title;
      var nodeSubtitle = subtitle || node.subtitle;

      var handle = void 0;
      if (canDrag) {
        if (typeof node.children === 'function' && node.expanded) {
          // Show a loading symbol on the handle when the children are expanded
          //  and yet still defined by a function (a callback to fetch the children)
          handle = _react2.default.createElement(
            'div',
            { className: 'rst__loadingHandle' },
            _react2.default.createElement(
              'div',
              { className: 'rst__loadingCircle' },
              [].concat(_toConsumableArray(new Array(12))).map(function (_, index) {
                return _react2.default.createElement('div', {
                  // eslint-disable-next-line react/no-array-index-key
                  key: index,
                  className: 'rst__loadingCirclePoint'
                });
              })
            )
          );
        } else {
          // Show the handle used to initiate a drag-and-drop
          handle = connectDragSource(_react2.default.createElement('div', { className: 'rst__moveHandle' }), {
            dropEffect: 'copy'
          });
        }
      }

      var isDraggedDescendant = draggedNode && (0, _treeDataUtils.isDescendant)(draggedNode, node);
      var isLandingPadActive = !didDrop && isDragging;

      return _react2.default.createElement(
        'div',
        _extends({ style: { height: '100%' } }, otherProps),
        toggleChildrenVisibility && node.children && (node.children.length > 0 || typeof node.children === 'function') && _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('button', {
            type: 'button',
            'aria-label': node.expanded ? 'Collapse' : 'Expand',
            className: node.expanded ? 'rst__collapseButton' : 'rst__expandButton',
            style: { left: -0.5 * scaffoldBlockPxWidth },
            onClick: function onClick() {
              return toggleChildrenVisibility({
                node: node,
                path: path,
                treeIndex: treeIndex
              });
            }
          }),
          node.expanded && !isDragging && _react2.default.createElement('div', {
            style: { width: scaffoldBlockPxWidth },
            className: 'rst__lineChildren'
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'rst__rowWrapper' },
          connectDragPreview(_react2.default.createElement(
            'div',
            {
              className: (0, _classnames2.default)('rst__row', isLandingPadActive && 'rst__rowLandingPad', isLandingPadActive && !canDrop && 'rst__rowCancelPad', isSearchMatch && 'rst__rowSearchMatch', isSearchFocus && 'rst__rowSearchFocus', className),
              style: _extends({
                opacity: isDraggedDescendant ? 0.5 : 1
              }, style)
            },
            handle,
            _react2.default.createElement(
              'div',
              {
                className: (0, _classnames2.default)('rst__rowContents', !canDrag && 'rst__rowContentsDragDisabled')
              },
              _react2.default.createElement(
                'div',
                { className: 'rst__rowLabel' },
                _react2.default.createElement(
                  'span',
                  {
                    className: (0, _classnames2.default)('rst__rowTitle', node.subtitle && 'rst__rowTitleWithSubtitle')
                  },
                  typeof nodeTitle === 'function' ? nodeTitle({
                    node: node,
                    path: path,
                    treeIndex: treeIndex
                  }) : nodeTitle
                ),
                nodeSubtitle && _react2.default.createElement(
                  'span',
                  { className: 'rst__rowSubtitle' },
                  typeof nodeSubtitle === 'function' ? nodeSubtitle({
                    node: node,
                    path: path,
                    treeIndex: treeIndex
                  }) : nodeSubtitle
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'rst__rowToolbar' },
                buttons.map(function (btn, index) {
                  return _react2.default.createElement(
                    'div',
                    {
                      key: index // eslint-disable-line react/no-array-index-key
                      , className: 'rst__toolbarButton'
                    },
                    btn
                  );
                })
              )
            )
          ))
        )
      );
    }
  }]);

  return NodeRendererDefault;
}(_react.Component);

NodeRendererDefault.defaultProps = {
  isSearchMatch: false,
  isSearchFocus: false,
  canDrag: false,
  toggleChildrenVisibility: null,
  buttons: [],
  className: '',
  style: {},
  parentNode: null,
  draggedNode: null,
  canDrop: false,
  title: null,
  subtitle: null
};

NodeRendererDefault.propTypes = {
  node: _propTypes2.default.shape({}).isRequired,
  title: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
  subtitle: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
  path: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])).isRequired,
  treeIndex: _propTypes2.default.number.isRequired,
  treeId: _propTypes2.default.string.isRequired,
  isSearchMatch: _propTypes2.default.bool,
  isSearchFocus: _propTypes2.default.bool,
  canDrag: _propTypes2.default.bool,
  scaffoldBlockPxWidth: _propTypes2.default.number.isRequired,
  toggleChildrenVisibility: _propTypes2.default.func,
  buttons: _propTypes2.default.arrayOf(_propTypes2.default.node),
  className: _propTypes2.default.string,
  style: _propTypes2.default.shape({}),

  // Drag and drop API functions
  // Drag source
  connectDragPreview: _propTypes2.default.func.isRequired,
  connectDragSource: _propTypes2.default.func.isRequired,
  parentNode: _propTypes2.default.shape({}), // Needed for dndManager
  isDragging: _propTypes2.default.bool.isRequired,
  didDrop: _propTypes2.default.bool.isRequired,
  draggedNode: _propTypes2.default.shape({}),
  // Drop target
  isOver: _propTypes2.default.bool.isRequired,
  canDrop: _propTypes2.default.bool
};

exports.default = NodeRendererDefault;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreePlaceholder = function (_Component) {
  _inherits(TreePlaceholder, _Component);

  function TreePlaceholder() {
    _classCallCheck(this, TreePlaceholder);

    return _possibleConstructorReturn(this, (TreePlaceholder.__proto__ || Object.getPrototypeOf(TreePlaceholder)).apply(this, arguments));
  }

  _createClass(TreePlaceholder, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          connectDropTarget = _props.connectDropTarget,
          treeId = _props.treeId,
          drop = _props.drop,
          otherProps = _objectWithoutProperties(_props, ['children', 'connectDropTarget', 'treeId', 'drop']);

      return connectDropTarget(_react2.default.createElement(
        'div',
        null,
        _react.Children.map(children, function (child) {
          return (0, _react.cloneElement)(child, _extends({}, otherProps));
        })
      ));
    }
  }]);

  return TreePlaceholder;
}(_react.Component);

TreePlaceholder.defaultProps = {
  canDrop: false,
  draggedNode: null
};

TreePlaceholder.propTypes = {
  children: _propTypes2.default.node.isRequired,

  // Drop target
  connectDropTarget: _propTypes2.default.func.isRequired,
  isOver: _propTypes2.default.bool.isRequired,
  canDrop: _propTypes2.default.bool,
  draggedNode: _propTypes2.default.shape({}),
  treeId: _propTypes2.default.string.isRequired,
  drop: _propTypes2.default.func.isRequired
};

exports.default = TreePlaceholder;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

__webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlaceholderRendererDefault = function PlaceholderRendererDefault(_ref) {
  var isOver = _ref.isOver,
      canDrop = _ref.canDrop;
  return _react2.default.createElement('div', {
    className: (0, _classnames2.default)('rst__placeholder', canDrop && 'rst__placeholderLandingPad', canDrop && !isOver && 'rst__placeholderCancelPad')
  });
};

PlaceholderRendererDefault.defaultProps = {
  isOver: false,
  canDrop: false
};

PlaceholderRendererDefault.propTypes = {
  isOver: _propTypes2.default.bool,
  canDrop: _propTypes2.default.bool
};

exports.default = PlaceholderRendererDefault;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slideRows = slideRows;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable import/prefer-default-export */

function slideRows(rows, fromIndex, toIndex) {
  var count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var rowsWithoutMoved = [].concat(_toConsumableArray(rows.slice(0, fromIndex)), _toConsumableArray(rows.slice(fromIndex + count)));

  return [].concat(_toConsumableArray(rowsWithoutMoved.slice(0, toIndex)), _toConsumableArray(rows.slice(fromIndex, fromIndex + count)), _toConsumableArray(rowsWithoutMoved.slice(toIndex)));
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDnd = __webpack_require__(21);

var _reactDndHtml5Backend = __webpack_require__(22);

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

var _reactDom = __webpack_require__(23);

var _treeDataUtils = __webpack_require__(0);

var _memoizedTreeDataUtils = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DndManager = function () {
  function DndManager(treeRef) {
    _classCallCheck(this, DndManager);

    this.treeRef = treeRef;
  }

  _createClass(DndManager, [{
    key: 'getTargetDepth',
    value: function getTargetDepth(dropTargetProps, monitor, component) {
      var dropTargetDepth = 0;

      var rowAbove = dropTargetProps.getPrevRow();
      if (rowAbove) {
        // Limit the length of the path to the deepest possible
        dropTargetDepth = Math.min(rowAbove.path.length, dropTargetProps.path.length);
      }

      var blocksOffset = void 0;
      var dragSourceInitialDepth = (monitor.getItem().path || []).length;

      // When adding node from external source
      if (monitor.getItem().treeId !== this.treeId) {
        // Ignore the tree depth of the source, if it had any to begin with
        dragSourceInitialDepth = 0;

        if (component) {
          var relativePosition = (0, _reactDom.findDOMNode)(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node
          var leftShift = monitor.getSourceClientOffset().x - relativePosition.left;
          blocksOffset = Math.round(leftShift / dropTargetProps.scaffoldBlockPxWidth);
        } else {
          blocksOffset = dropTargetProps.path.length;
        }
      } else {
        blocksOffset = Math.round(monitor.getDifferenceFromInitialOffset().x / dropTargetProps.scaffoldBlockPxWidth);
      }

      var targetDepth = Math.min(dropTargetDepth, Math.max(0, dragSourceInitialDepth + blocksOffset - 1));

      // If a maxDepth is defined, constrain the target depth
      if (typeof this.maxDepth !== 'undefined' && this.maxDepth !== null) {
        var draggedNode = monitor.getItem().node;
        var draggedChildDepth = (0, _treeDataUtils.getDepth)(draggedNode);

        targetDepth = Math.max(0, Math.min(targetDepth, this.maxDepth - draggedChildDepth - 1));
      }

      return targetDepth;
    }
  }, {
    key: 'canDrop',
    value: function canDrop(dropTargetProps, monitor) {
      if (!monitor.isOver()) {
        return false;
      }

      var rowAbove = dropTargetProps.getPrevRow();
      var abovePath = rowAbove ? rowAbove.path : [];
      var aboveNode = rowAbove ? rowAbove.node : {};
      var targetDepth = this.getTargetDepth(dropTargetProps, monitor, null);

      // Cannot drop if we're adding to the children of the row above and
      //  the row above is a function
      if (targetDepth >= abovePath.length && typeof aboveNode.children === 'function') {
        return false;
      }

      if (typeof this.customCanDrop === 'function') {
        var _monitor$getItem = monitor.getItem(),
            node = _monitor$getItem.node;

        var addedResult = (0, _memoizedTreeDataUtils.memoizedInsertNode)({
          treeData: this.treeData,
          newNode: node,
          depth: targetDepth,
          getNodeKey: this.getNodeKey,
          minimumTreeIndex: dropTargetProps.listIndex,
          expandParent: true
        });

        return this.customCanDrop({
          node: node,
          prevPath: monitor.getItem().path,
          prevParent: monitor.getItem().parentNode,
          prevTreeIndex: monitor.getItem().treeIndex, // Equals -1 when dragged from external tree
          nextPath: addedResult.path,
          nextParent: addedResult.parentNode,
          nextTreeIndex: addedResult.treeIndex
        });
      }

      return true;
    }
  }, {
    key: 'wrapSource',
    value: function wrapSource(el) {
      var _this = this;

      var nodeDragSource = {
        beginDrag: function beginDrag(props) {
          _this.startDrag(props);

          return {
            node: props.node,
            parentNode: props.parentNode,
            path: props.path,
            treeIndex: props.treeIndex,
            treeId: props.treeId
          };
        },

        endDrag: function endDrag(props, monitor) {
          _this.endDrag(monitor.getDropResult());
        },

        isDragging: function isDragging(props, monitor) {
          var dropTargetNode = monitor.getItem().node;
          var draggedNode = props.node;

          return draggedNode === dropTargetNode;
        }
      };

      function nodeDragSourcePropInjection(connect, monitor) {
        return {
          connectDragSource: connect.dragSource(),
          connectDragPreview: connect.dragPreview(),
          isDragging: monitor.isDragging(),
          didDrop: monitor.didDrop()
        };
      }

      return (0, _reactDnd.DragSource)(this.dndType, nodeDragSource, nodeDragSourcePropInjection)(el);
    }
  }, {
    key: 'wrapTarget',
    value: function wrapTarget(el) {
      var _this2 = this;

      var nodeDropTarget = {
        drop: function drop(dropTargetProps, monitor, component) {
          var result = {
            node: monitor.getItem().node,
            path: monitor.getItem().path,
            treeIndex: monitor.getItem().treeIndex,
            treeId: _this2.treeId,
            minimumTreeIndex: dropTargetProps.treeIndex,
            depth: _this2.getTargetDepth(dropTargetProps, monitor, component)
          };

          _this2.drop(result);

          return result;
        },

        hover: function hover(dropTargetProps, monitor, component) {
          var targetDepth = _this2.getTargetDepth(dropTargetProps, monitor, component);
          var draggedNode = monitor.getItem().node;
          var needsRedraw =
          // Redraw if hovered above different nodes
          dropTargetProps.node !== draggedNode ||
          // Or hovered above the same node but at a different depth
          targetDepth !== dropTargetProps.path.length - 1;

          if (!needsRedraw) {
            return;
          }

          _this2.dragHover({
            node: draggedNode,
            path: monitor.getItem().path,
            minimumTreeIndex: dropTargetProps.listIndex,
            depth: targetDepth
          });
        },

        canDrop: this.canDrop.bind(this)
      };

      function nodeDropTargetPropInjection(connect, monitor) {
        var dragged = monitor.getItem();
        return {
          connectDropTarget: connect.dropTarget(),
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
          draggedNode: dragged ? dragged.node : null
        };
      }

      return (0, _reactDnd.DropTarget)(this.dndType, nodeDropTarget, nodeDropTargetPropInjection)(el);
    }
  }, {
    key: 'wrapPlaceholder',
    value: function wrapPlaceholder(el) {
      var _this3 = this;

      var placeholderDropTarget = {
        drop: function drop(dropTargetProps, monitor) {
          var _monitor$getItem2 = monitor.getItem(),
              node = _monitor$getItem2.node,
              path = _monitor$getItem2.path,
              treeIndex = _monitor$getItem2.treeIndex;

          var result = {
            node: node,
            path: path,
            treeIndex: treeIndex,
            treeId: _this3.treeId,
            minimumTreeIndex: 0,
            depth: 0
          };

          _this3.drop(result);

          return result;
        }
      };

      function placeholderPropInjection(connect, monitor) {
        var dragged = monitor.getItem();
        return {
          connectDropTarget: connect.dropTarget(),
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
          draggedNode: dragged ? dragged.node : null
        };
      }

      return (0, _reactDnd.DropTarget)(this.dndType, placeholderDropTarget, placeholderPropInjection)(el);
    }
  }, {
    key: 'startDrag',
    get: function get() {
      return this.treeRef.startDrag;
    }
  }, {
    key: 'dragHover',
    get: function get() {
      return this.treeRef.dragHover;
    }
  }, {
    key: 'endDrag',
    get: function get() {
      return this.treeRef.endDrag;
    }
  }, {
    key: 'drop',
    get: function get() {
      return this.treeRef.drop;
    }
  }, {
    key: 'treeId',
    get: function get() {
      return this.treeRef.treeId;
    }
  }, {
    key: 'dndType',
    get: function get() {
      return this.treeRef.dndType;
    }
  }, {
    key: 'treeData',
    get: function get() {
      return this.treeRef.state.draggingTreeData || this.treeRef.props.treeData;
    }
  }, {
    key: 'getNodeKey',
    get: function get() {
      return this.treeRef.props.getNodeKey;
    }
  }, {
    key: 'customCanDrop',
    get: function get() {
      return this.treeRef.props.canDrop;
    }
  }, {
    key: 'maxDepth',
    get: function get() {
      return this.treeRef.props.maxDepth;
    }
  }], [{
    key: 'wrapRoot',
    value: function wrapRoot(el) {
      return (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(el);
    }
  }]);

  return DndManager;
}();

exports.default = DndManager;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("react-dnd");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("react-dnd-html5-backend");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});
//# sourceMappingURL=main.js.map