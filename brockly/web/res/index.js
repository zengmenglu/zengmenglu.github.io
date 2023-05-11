/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

// Create a namespace.
var BlocklyStorage = {};

/**
 * Backup code blocks to localStorage.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
BlocklyStorage.backupBlocks_ = function (workspace) {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    // Gets the current URL, not including the hash.
    var url = window.location.href.split('#')[0];
    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
  }
};

/**
 * Bind the localStorage backup function to the unload event.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
BlocklyStorage.backupOnUnload = function (opt_workspace) {
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  window.addEventListener(
    'unload',
    function () {
      BlocklyStorage.backupBlocks_(workspace);
    },
    false
  );
};

/**
 * Restore code blocks from localStorage.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
BlocklyStorage.restoreBlocks = function (opt_workspace) {
  var url = window.location.href.split('#')[0];
  if ('localStorage' in window && window.localStorage[url]) {
    var workspace = opt_workspace || Blockly.getMainWorkspace();
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }
};

/**
 * Save blocks to database and return a link containing key to XML.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
BlocklyStorage.link = function (opt_workspace) {
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  var xml = Blockly.Xml.workspaceToDom(workspace, true);
  // Remove x/y coordinates from XML if there's only one block stack.
  // There's no reason to store this, removing it helps with anonymity.
  if (workspace.getTopBlocks(false).length == 1 && xml.querySelector) {
    var block = xml.querySelector('block');
    if (block) {
      block.removeAttribute('x');
      block.removeAttribute('y');
    }
  }
  var data = Blockly.Xml.domToText(xml);
  BlocklyStorage.makeRequest_('/storage', 'xml', data, workspace);
};

/**
 * Retrieve XML text from database using given key.
 * @param {string} key Key to XML, obtained from href.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
BlocklyStorage.retrieveXml = function (key, opt_workspace) {
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  BlocklyStorage.makeRequest_('/storage', 'key', key, workspace);
};

/**
 * Global reference to current AJAX request.
 * @type {XMLHttpRequest}
 * @private
 */
BlocklyStorage.httpRequest_ = null;

/**
 * Fire a new AJAX request.
 * @param {string} url URL to fetch.
 * @param {string} name Name of parameter.
 * @param {string} content Content of parameter.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
BlocklyStorage.makeRequest_ = function (url, name, content, workspace) {
  if (BlocklyStorage.httpRequest_) {
    // AJAX call is in-flight.
    BlocklyStorage.httpRequest_.abort();
  }
  BlocklyStorage.httpRequest_ = new XMLHttpRequest();
  BlocklyStorage.httpRequest_.name = name;
  BlocklyStorage.httpRequest_.onreadystatechange =
    BlocklyStorage.handleRequest_;
  BlocklyStorage.httpRequest_.open('POST', url);
  BlocklyStorage.httpRequest_.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  BlocklyStorage.httpRequest_.send(name + '=' + encodeURIComponent(content));
  BlocklyStorage.httpRequest_.workspace = workspace;
};

/**
 * Callback function for AJAX call.
 * @private
 */
BlocklyStorage.handleRequest_ = function () {
  if (BlocklyStorage.httpRequest_.readyState == 4) {
    if (BlocklyStorage.httpRequest_.status != 200) {
      BlocklyStorage.alert(
        BlocklyStorage.HTTPREQUEST_ERROR +
          '\n' +
          'httpRequest_.status: ' +
          BlocklyStorage.httpRequest_.status
      );
    } else {
      var data = BlocklyStorage.httpRequest_.responseText.trim();
      if (BlocklyStorage.httpRequest_.name == 'xml') {
        window.location.hash = data;
        BlocklyStorage.alert(
          BlocklyStorage.LINK_ALERT.replace('%1', window.location.href)
        );
      } else if (BlocklyStorage.httpRequest_.name == 'key') {
        if (!data.length) {
          BlocklyStorage.alert(
            BlocklyStorage.HASH_ERROR.replace('%1', window.location.hash)
          );
        } else {
          BlocklyStorage.loadXml_(data, BlocklyStorage.httpRequest_.workspace);
        }
      }
      BlocklyStorage.monitorChanges_(BlocklyStorage.httpRequest_.workspace);
    }
    BlocklyStorage.httpRequest_ = null;
  }
};

/**
 * Start monitoring the workspace.  If a change is made that changes the XML,
 * clear the key from the URL.  Stop monitoring the workspace once such a
 * change is detected.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
BlocklyStorage.monitorChanges_ = function (workspace) {
  var startXmlDom = Blockly.Xml.workspaceToDom(workspace);
  var startXmlText = Blockly.Xml.domToText(startXmlDom);
  function change() {
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);
    var xmlText = Blockly.Xml.domToText(xmlDom);
    if (startXmlText != xmlText) {
      window.location.hash = '';
      workspace.removeChangeListener(change);
    }
  }
  workspace.addChangeListener(change);
};

/**
 * Load blocks from XML.
 * @param {string} xml Text representation of XML.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
BlocklyStorage.loadXml_ = function (xml, workspace) {
  try {
    xml = Blockly.Xml.textToDom(xml);
  } catch (e) {
    BlocklyStorage.alert(BlocklyStorage.XML_ERROR + '\nXML: ' + xml);
    return;
  }
  // Clear the workspace to avoid merge.
  workspace.clear();
  Blockly.Xml.domToWorkspace(xml, workspace);
};

/**
 * Present a text message to the user.
 * Designed to be overridden if an app has custom dialogs, or a butter bar.
 * @param {string} message Text to alert.
 */
BlocklyStorage.alert = function (message) {
  window.alert(message);
};

var theme = {
  list_blocks: {
    colourPrimary: '#4a148c',
    colourSecondary: '#AD7BE9',
    colourTertiary: '#CDB6E9',
  },
  logic_blocks: {
    colourPrimary: '#01579b',
    colourSecondary: '#64C7FF',
    colourTertiary: '#C5EAFF',
  },
};

var zoom = {
  controls: true,
  wheel: true,
  startScale: 1.0,
  maxScale: 3,
  minScale: 0.3,
  scaleSpeed: 1.2,
  pinch: true,
};

var omit = ['"context"', '"log"', '"os"', '"os/signal"', '"time"', '"strings"'];

// 基础
// import package
Blockly.Blocks['require'] = {
  init: function () {
    this.setInputsInline(true);

    this.setTooltip('Import Go package');
    this.setHelpUrl('');
    this.setColour(230);
    this.appendValueInput('VALUE').setCheck('String').appendField('Import');
  },
};

Blockly.JavaScript['require'] = function (block) {
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    'VALUE',
    Blockly.JavaScript.ORDER_ATOMIC
  );

  //var text_hostname = block.getFieldValue('hostname');
  //var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  // TODO: Assemble JavaScript into code variable.
  console.log(value_name);
  var code = '';
  var importPkg = value_name.split("'").join('"');

  if (omit.indexOf(importPkg) === -1) {
    code = `import ${importPkg}
  `;
  }

  return code;
};

// 结构体
Blockly.Blocks['structure'] = {
  init: function () {
    this.appendDummyInput()
        .appendField('自定义数据结构:')
        .appendField(new Blockly.FieldTextInput('name'), 'struct_name');
    this.appendStatementInput('struct_item').setCheck('struct_item').appendField('字段列表：');
    this.setInputsInline(true);
    // this.setOutput(true, null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(110);
    this.setTooltip('Go interface');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['structure'] = function (block) {
  var struct_name = block.getFieldValue( 'struct_name');
  var struct_items = Blockly.JavaScript.statementToCode(block, 'struct_item')
  var code = `type ${struct_name} struct {
    ${struct_items}
}

`;
  return code;
};

// 结构体字段
Blockly.Blocks['struct_item'] = {
  init: function () {
    this.appendDummyInput()
        .appendField('名称:')
        .appendField(new Blockly.FieldTextInput('数据结构字段名称（英文）'), 'item_name')
        .appendField(', 类型:')
        .appendField(
            new Blockly.FieldDropdown([['字符串', 'string'],['整数','int'],['小数','float64']]),
            'item_type'
        );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(110);
    this.setTooltip('Go structure item');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['struct_item'] = function (block) {
  var item_name = block.getFieldValue('item_name');
  var item_type = block.getFieldValue('item_type');
  var code = `${item_name}  ${item_type}
    `;
  return code;
};


// 累加器
Blockly.Blocks['accumulate'] = {
  init: function () {
    this.appendStatementInput('is_vote').appendField('如果');
    this.appendDummyInput().appendField('计数器累加1');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
  },
};

Blockly.JavaScript['accumulate'] = function (block) {
  //var people = block.getFieldValue('is_vote');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'is_vote');
  var code = `if isVote{
    vote++
    return
  }
  `;
  return code;
};

// 向上取整
Blockly.Blocks['round_up'] = {
  init: function () {
    this.setInputsInline(true);
    this.setHelpUrl('');
    this.setColour(230);
    this.appendValueInput('VALUE').setCheck("Number").appendField('对');
    this.appendDummyInput().appendField('向上取整');
    this.setOutput(true, null);
  },
};

Blockly.JavaScript['round_up'] = function (block) {
  var value = Blockly.JavaScript.valueToCode(
      block,
      'VALUE',
      Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = `math.Ceil(${value})
  `;

  return code;
};

// 向下取整
Blockly.Blocks['round_down'] = {
  init: function () {
    this.setInputsInline(true);
    this.setHelpUrl('');
    this.setColour(230);
    this.appendValueInput('VALUE').setCheck('Number').appendField('对');
    this.appendDummyInput().appendField('向下取整');
    this.setOutput(true, null);
  },
};

Blockly.JavaScript['round_down'] = function (block) {
  var value = Blockly.JavaScript.valueToCode(
      block,
      'VALUE',
      Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = `math.Floor(${value})
  `;

  return code;
};

Blockly.Blocks['server'] = {
  init: function () {
    this.appendStatementInput('children')
      .setCheck(['port', 'hostname', 'endpoints', 'on_start'])
      .appendField('Server');

    this.appendDummyInput()
      .appendField('Port')
      .appendField(new Blockly.FieldNumber(8080), 'port');
    this.appendDummyInput()
      .appendField('Hostname')
      .appendField(new Blockly.FieldTextInput('127.0.0.1'), 'hostname');

    this.setInputsInline(true);
    this.setColour(105);
    this.setTooltip('Defines a server root');

    this.setHelpUrl('');
  },
};

Blockly.Blocks['http_handle'] = {
  init: function () {
    this.appendStatementInput('children').setCheck(null).appendField('Handle');

    this.appendDummyInput()
      .appendField('Path')
      .appendField(new Blockly.FieldTextInput('/'), 'path');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setColour(105);
    this.setTooltip('Represents net/http.Handle');

    this.setHelpUrl('');
  },
};

Blockly.Blocks['http_handlerFunc'] = {
  init: function () {
    this.appendStatementInput('children')
      .setCheck(null)
      .appendField('Handle with function');

    this.appendDummyInput()
      .appendField('Path')
      .appendField(new Blockly.FieldTextInput('/'), 'path');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setColour(105);
    this.setTooltip('Represents net/http.HandleFunc');

    this.setHelpUrl('');
  },
};

Blockly.Blocks['main'] = {
  init: function () {
    this.appendStatementInput('children').setCheck(null).appendField('Main');

    this.setInputsInline(true);
    this.setColour(105);
    this.setTooltip("Defines a program's main function");

    this.setHelpUrl('');
  },
};

Blockly.Blocks['route_group'] = {
  init: function () {
    this.appendStatementInput('NAME')
      .setCheck('route')
      .appendField('Route Group');

    this.setPreviousStatement(true, null);

    this.setColour(345);
    this.setTooltip('Define a Web api route group');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['route_group'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  //var text_hostname = block.getFieldValue('hostname');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');

  console.log(statements_name);
  var code = `apiHandler := func(w http.ResponseWriter, r *http.Request) {
     path := ""
     ${statements_name}
  }
  `;
  return code;
};

Blockly.JavaScript['http_handle'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  var text_path = block.getFieldValue('path');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'children');

  var code = `http.Handle("${text_path}", ${statements_name.replace('\n', '')})
`;
  return code;
};

Blockly.JavaScript['http_handlerFunc'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  //var text_hostname = block.getFieldValue('hostname');
  var text_path = block.getFieldValue('path');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'children');

  var code = `http.HandleFunc("${text_path}", ${statements_name.replace(
    '\n',
    ''
  )})
`;
  return code;
};



// 定时器
//获取时钟服务
Blockly.Blocks['timer_institute'] = {
  init: function () {
    // this.appendDummyInput().appendField('从CA获取时钟服务');
    this.appendValueInput('the_time').setCheck(null).appendField('从CA获取时钟服务');
    this.setOutput(true, null);
    this.setInputsInline(false);
    this.setColour(150);
  },
};

Blockly.JavaScript['timer_institute'] = function (block) {
  var the_time = Blockly.JavaScript.valueToCode(block, 'the_time', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `getTimerFromCA("${the_time}")
  `;
  return code;
};

// 定时器定时触发
Blockly.Blocks['timer'] = {
  init: function () {
    this.appendDummyInput()
        .appendField('当定时器')
        .appendField(new Blockly.FieldTextInput('event_1'), 'item')
        .appendField('触发时');
    // this.appendValueInput('event_id').setCheck(null).appendField('定时器事件');
    this.appendStatementInput('contract').setCheck(null).appendField('');
    // this.setInputsInline(true);
    this.setColour(105);
    this.setTooltip('');

    this.setHelpUrl('');
  },
};

Blockly.JavaScript['timer'] = function (block) {
  var id = block.getFieldValue('event_id');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'contract');
  var code = `if trigger(${id}) {
  ${statements_name}()
    return
}
  `;
  return code;
};

// 触发合约
Blockly.Blocks['invoke'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('当')
      .appendField(
        new Blockly.FieldDropdown([['业委会主任', 'committer']]),
        'people'
      ).appendField('触发时');
    this.appendStatementInput('contract').setCheck(null).appendField('');
    this.setColour(345);
  },
};

Blockly.JavaScript['invoke'] = function (block) {
  var people = block.getFieldValue('people');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'contract');
  var code = `if ${people}() {
  ${statements_name}()
    return
  }
  `;
  return code;
};

// 合约执行动作列表
Blockly.Blocks['contract_handle_list'] = {
  init: function () {
    this.appendStatementInput('methods')
      .setCheck(null)
      .appendField('合约执行动作列表');
    this.setInputsInline(false);

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Go interface');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['contract_handle_list'] = function (block) {
  var people = block.getFieldValue('methods');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'methods');
  var code = `
func NewVoteCount() *VoteCount {
	return &voteCount{}
}

func (voteCount *VoteCount) InitContract() protogo.Response {
	return sdk.Success([]byte("Init contract success"))
}

func (voteCount *VoteCount) UpgradeContract() protogo.Response {
	return sdk.Success([]byte("Upgrade contract success"))
}

func (voteCount *VoteCount) InvokeContract(method string) protogo.Response {
	${statements_name}\n
}
`;
  return code;
};

Blockly.Blocks['resident'] = {
  init: function () {
    this.appendDummyInput('').appendField('住户信息结构初始化');
    // this.setInputsInline(false);
    // this.setOutput(true, null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['resident'] = function (block) {
  var code = `type resident struct {
	Id        string
	AccountId string
	Area      float64
	Name      string
}

`;
  return code;
};

Blockly.Blocks['vote_info'] = {
  init: function () {
    this.appendDummyInput('').appendField('投票信息结构初始化');
    // this.setInputsInline(false);
    // this.setOutput(true, null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['vote_info'] = function (block) {
  var code = `type VoteCount struct {
	Roster       []string
	ApprovalNum  uint
	TotalNum     uint
	ApprovalRate float64
	ApprovalArea float64
	TotalArea    float64
	AreaRate     float64
}

`;
  return code;
};


Blockly.Blocks['contract_name'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('调用合约 ')
      .appendField(
        new Blockly.FieldDropdown([
          ['计票合约', 'vote_count_contract'],
          ['投票合约', 'vote_contract'],
        ]),
        'contractName'
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Line of Go code');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['contract_name'] = function (block) {
  var name = block.getFieldValue('contractName');
  return name;
};

Blockly.Blocks['route'] = {
  init: function () {
    this.appendDummyInput().appendField('Route');
    this.appendDummyInput()
      .appendField('Path')
      .appendField(new Blockly.FieldTextInput('/hello'), 'path');
    this.appendDummyInput()
      .appendField('Method')
      .appendField(
        new Blockly.FieldDropdown([
          ['GET', 'GET'],
          ['PUT', 'PUT'],
          ['PATCH', 'PATCH'],
          ['POST', 'POST'],
          ['DELETE', 'DELETE'],
          ['OPTION', 'OPTION'],
        ]),
        'method'
      );
    this.appendStatementInput('sub')
      .setCheck('route')
      .appendField('Sub routes');
    this.appendDummyInput()
      .appendField('Handler')
      .appendField(new Blockly.FieldTextInput('pkg.Handler(w, *r)'), 'handler');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('Individual route');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['route'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  var path = block.getFieldValue('path');
  var method = block.getFieldValue('method');
  var handler = block.getFieldValue('handler');

  var statements_name = Blockly.JavaScript.statementToCode(block, 'sub');

  console.log(statements_name);
  var code = `if strings.Contains( r.URL.Path, path + "${path}" ) && r.Method == "${method}" {
     path = path + "${path}"
     ${statements_name}
     ${handler}
     return
  }
  `;
  return code;
};

Blockly.Blocks['on_start'] = {
  init: function () {
    this.appendStatementInput('NAME')
      .setCheck('go')
      .appendField('On Server start');
    this.setInputsInline(false);
    this.setPreviousStatement(true, [
      'on_start',
      'go',
      'on_shutdown',
      'on_recover',
    ]);
    this.setNextStatement(true, [
      'on_start',
      'go',
      'on_shutdown',
      'on_recover',
    ]);
    this.setColour(230);
    this.setTooltip('Code to run on server boot');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['on_start'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  //var text_hostname = block.getFieldValue('hostname');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');

  console.log(statements_name);
  var code = statements_name;
  return code;
};

/*
stop := make(chan os.Signal, 1)

   signal.Notify(stop, os.Interrupt)

*/

Blockly.Blocks['on_shutdown'] = {
  init: function () {
    this.appendStatementInput('NAME')
      .setCheck('go')
      .appendField('On Server shutdown');
    this.setInputsInline(false);
    this.setPreviousStatement(true, [
      'on_start',
      'go',
      'on_shutdown',
      'on_recover',
    ]);
    this.setNextStatement(true, [
      'on_start',
      'go',
      'on_shutdown',
      'on_recover',
    ]);
    this.setColour(230);
    this.setTooltip('Code to run on server exit');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['on_shutdown'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  //var text_hostname = block.getFieldValue('hostname');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');

  var code = `stop := make(chan os.Signal, 1)
   signal.Notify(stop, os.Interrupt)
  
   go func() {
      <-stop
       log.Println("Shutting down the server...")

       ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
       h.Shutdown(ctx)

       ${statements_name}
       log.Println("Server gracefully stopped")
   }()
  `;

  return code;
};

Blockly.Blocks['go'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Go ')
      .appendField(new Blockly.FieldTextInput('println("Sample")'), 'line');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Line of Go code');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['go'] = function (block) {
  //var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  var text = block.getFieldValue('line');
  //var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');

  var code = `${text}
  `;
  return code;
};

// Code gen

Blockly.JavaScript['server'] = function (block) {
  var number_port = block.getFieldValue('port');
  var text_hostname = block.getFieldValue('hostname');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'children');
  // TODO: Assemble JavaScript into code variable.
  var packages = [];

  for (var i = omit.length - 1; i >= 0; i--) {
    var p = omit[i];
    var path_parts = p.split('/');
    var p_name = path_parts[path_parts.length - 1];

    var pSanit = p_name.split('"').join('');

    if (statements_name.includes(`${pSanit}.`) || pSanit == 'log') {
      packages.push(`import ${p}`);
    }
  }

  var importStr = packages.join('\n');

  var code = `
${importStr}

func main() {

  h := &http.Server{Addr:  "${text_hostname}:${number_port}" }

   
${statements_name}

   http.HandleFunc("/", apiHandler)

   
   err := h.ListenAndServe()
   if err != nil {
      log.Println(err)
   }

}
`;
  return code;
};

Blockly.JavaScript['main'] = function (block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'children');
  // TODO: Assemble JavaScript into code variable.
  var packages = [];

  for (var i = omit.length - 1; i >= 0; i--) {
    var p = omit[i];
    var path_parts = p.split('/');
    var p_name = path_parts[path_parts.length - 1];

    var pSanit = p_name.split('"').join('');

    if (statements_name.includes(`${pSanit}.`)) {
      packages.push(`import ${p}`);
    }
  }

  var importStr = packages.join('\n');

  var code = `
${importStr}

func main() {
  
${statements_name}

}
`;
  return code;
};

Blockly.Blocks['interface'] = {
  init: function () {
    this.appendStatementInput('ints').setCheck(null).appendField('Map');
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('Go interface');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['interface'] = function (block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'ints');
  // TODO: Assemble JavaScript into code variable.
  var code = `map[string]interface{}{
    ${statements_name}
}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.Blocks['field'] = {
  init: function () {
    this.appendValueInput('NAME')
      .setCheck(null)
      .appendField(new Blockly.FieldTextInput('key_name'), 'key');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Go interface field');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['field'] = function (block) {
  var text_key = block.getFieldValue('key');
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    'NAME',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  // TODO: Assemble JavaScript into code variable.

  if (value_name[0] == "'" && value_name[value_name.length - 1] == "'")
    value_name = value_name.split("'").join('"');

  var code = `"${text_key}" : ${value_name},
`;
  return code;
};

Blockly.Blocks['handler'] = {
  init: function () {
    this.appendDummyInput().appendField('HTTP  Handler');
    this.appendDummyInput()
      .appendField('Path')
      .appendField(new Blockly.FieldTextInput('/'), 'path');
    this.appendDummyInput()
      .appendField('Handler')
      .appendField(new Blockly.FieldTextInput('pkg.handler'), 'func');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip('Adds a handler to your server');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['handler'] = function (block) {
  var text_path = block.getFieldValue('path');
  var text_func = block.getFieldValue('func');
  // TODO: Assemble JavaScript into code variable.
  var code = `http.HandleFunc("${text_path}", ${text_func})
`;
  return code;
};

var xmlToString = (xml) => {
  var s = new XMLSerializer();
  var str = s.serializeToString(xml);
};

var stringToXml = (str) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, 'application/xml');
  return doc;
};

var setDefault = () => {
  workspace.clear();
  //var temp = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="require" id="JqCkcv]bLOT(jC7{8@NO" x="29" y="14"><value name="VALUE"><block type="text" id="ghuK=W/u%?LQz%.Ut`_r"><field name="TEXT">net/http</field></block></value></block></xml>'
  //var xml = Blockly.Xml.textToDom(temp);
  //Blockly.Xml.domToWorkspace(xml, workspace);
};

var exportCode = () => {
  var pkgName = document.getElementById('pkgName').value;
  var zip = new JSZip();
  var cmd = zip.folder('cmd');
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  cmd.file(
    'main.go',
    `package main
  
import (
	"chainmaker.org/chainmaker/contract-sdk-go/v2/pb/protogo"
	"chainmaker.org/chainmaker/contract-sdk-go/v2/sdk"
)

` + code
  );

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    // see FileSaver.js
    saveAs(content, pkgName.split('/').join('.') + '.zip');
  });
};

function showPreview(event) {
  if (!workspace) return;

  var code = Blockly.JavaScript.workspaceToCode(workspace);
  code =
    `package main
  
import (
	"chainmaker.org/chainmaker/contract-sdk-go/v2/pb/protogo"
	"chainmaker.org/chainmaker/contract-sdk-go/v2/sdk"
)

` + code;

  document.getElementById('textPreview').value = code;
}
