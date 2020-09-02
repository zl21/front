/*
 * email: bigablecat@hotmail.com
 * Date: 2018-04-14
 */

/**
 * @param zTreeId the ztree id used to get the ztree object
 * @param searchField selector of your input for fuzzy search
 * @param isHighLight whether highlight the match words, default true
 * @param isExpand whether to expand the node, default false
 * 
 * @returns
 */	


export const fuzzySearch = (zTreeId, searchField, isHighLight, isExpand) => {
  const zTreeObj = $.fn.zTree.getZTreeObj(zTreeId);// get the ztree object by ztree id
  if (!zTreeObj) {
    alert('fail to get ztree object');
  }
  const nameKey = zTreeObj.setting.data.key.name; // get the key of the node name
  isHighLight = isHighLight !== false;// default true, only use false to disable highlight
  isExpand = !!isExpand; // not to expand in default
  zTreeObj.setting.view.nameIsHTML = isHighLight; // allow use html in node name for highlight use
	
  const metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; // js meta characters
  const rexMeta = new RegExp(metaChar, 'gi');// regular expression to match meta characters
	
  // keywords filter function 
  function ztreeFilter(zTreeObjRes, _keywords, callBackFunc) {
    if (!_keywords) {
      _keywords = ''; // default blank for _keywords 
    }
		
    // function to find the matching node
    function filterFunc(node) {
      if (node && node.oldname && node.oldname.length > 0) {
        node[nameKey] = node.oldname; // recover oldname of the node if exist
      }
      zTreeObjRes.updateNode(node); // update node to for modifications take effect
      if (_keywords.length === 0) {
        // return true to show all nodes if the keyword is blank
        zTreeObjRes.showNode(node);
        zTreeObjRes.expandNode(node, isExpand);
        return true;
      }
      // transform node name and keywords to lowercase
      if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) != -1) {
        if (isHighLight) { // highlight process
          // a new variable 'newKeywords' created to store the keywords information 
          // keep the parameter '_keywords' as initial and it will be used in next node
          // process the meta characters in _keywords thus the RegExp can be correctly used in str.replace
          const newKeywords = _keywords.replace(rexMeta, matchStr => 
          // add escape character before meta characters
						 `\\${matchStr}`);
          node.oldname = node[nameKey]; // store the old name  
          const rexGlobal = new RegExp(newKeywords, 'gi');// 'g' for global,'i' for ignore case
          // use replace(RegExp,replacement) since replace(/substr/g,replacement) cannot be used here
          node[nameKey] = node.oldname.replace(rexGlobal, (originalText) => {
            // highlight the matching words in node name
            const highLightText = `<span style="color: whitesmoke;background-color: #e80707;">${originalText}</span>`;
            return highLightText;				
          });
          zTreeObjRes.updateNode(node); // update node for modifications take effect
        }
        zTreeObjRes.showNode(node);// show node with matching keywords
        return true; // return true and show this node
      }
			
      // zTreeObjRes.hideNode(node); // hide node that not matched//此方法用于模糊搜索后只返回当前节点呢，注释为了显示全部节点
      return false; // return false for node not matched
    }
    function processShowNodes(nodesShow, _keywords) {
      if (nodesShow && nodesShow.length > 0) {
        // process the ancient nodes if _keywords is not blank
        if (_keywords.length > 0) { 
          $.each(nodesShow, (n, obj) => {
            const pathOfOne = obj.getPath();// get all the ancient nodes including current node
            if (pathOfOne && pathOfOne.length > 0) { 
              // i < pathOfOne.length-1 process every node in path except self
              for (let i = 0; i < pathOfOne.length - 1; i++) {
                zTreeObj.showNode(pathOfOne[i]); // show node 
                zTreeObj.expandNode(pathOfOne[i], true); // expand node
              }
            }
          });	
        } else { // show all nodes when _keywords is blank and expand the root nodes
          const rootNodes = zTreeObj.getNodesByParam('level', '0');// get all root nodes
          $.each(rootNodes, (n, obj) => {
            zTreeObj.expandNode(obj, true); // expand all root nodes
          });
        }
      }
    }
    const nodesShow = zTreeObj.getNodesByFilter(filterFunc); // get all nodes that would be shown
    processShowNodes(nodesShow, _keywords);// nodes should be reprocessed to show correctly
  }
	
  /**
	 * reprocess of nodes before showing
	 */
  
	
  // listen to change in input element
  // $(searchField).bind('input propertychange', function () {
  //   const _keywords = $(this).val();
  //   searchNodeLazy(_keywords); // call lazy load
  // });
  

  let timeoutId = null;
  let lastKeyword = '';
  // excute lazy load once after input change, the last pending task will be cancled  
  function searchNodeLazy(_keywords) {
    if (timeoutId) { 
      // clear pending task
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      if (lastKeyword === _keywords) {
        return;
      }
      ztreeFilter(zTreeObj, _keywords); // lazy load ztreeFilter function 
      // $(searchField).focus();//focus input field again after filtering
      lastKeyword = _keywords;
      document.getElementById(zTreeId).scrollTop = 0;// 检索字符完成后将滚动条设置到顶部
    }, 500);
  }
  if (searchField) { // 检测到搜索的字符，调用以下逻辑
    searchNodeLazy(searchField); 
  }
};
export default fuzzySearch;
