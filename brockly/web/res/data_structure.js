/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author mengluzeng@163.com
 */
'use strict';

// 字符串
Blockly.Blocks['text'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(''), 'key');
        this.setInputsInline(false);
        this.setOutput(true)
        this.setColour(230);
        this.setTooltip('Go interface field');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['text'] = function (block) {
    var text_key = block.getFieldValue('key');
    return text_key;
};

// map
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

// map key
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

Blockly.Blocks['get_vote_info'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('获取投票编号为')
            .appendField(new Blockly.FieldTextInput('vote_1'), 'vote_id')
            .appendField('的投票花名册');

        // this.setInputsInline(false);
        this.setOutput(true, null);
        // this.setPreviousStatement(true, null);
        // this.setNextStatement(true, null);
        this.setColour(345);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['get_vote_info'] = function (block) {
    var code = `get voting information()`;
    return code;
};


//循环计算
Blockly.Blocks['for_range'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('将')
            .appendField(new Blockly.FieldTextInput('投票花名册'), 'people_list')
            .appendField('中的元素逐个取出');
        this.appendStatementInput('do').appendField('');
        // this.setInputsInline(false);
        // this.setOutput(true, null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['for_range'] = function (block) {
    var code = `//todo`;
    return code;
};


// if
Blockly.Blocks['if'] = {
    init: function () {
        this.appendStatementInput('judge').appendField('如果');
        this.appendStatementInput('do').appendField('');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
    },
};

Blockly.JavaScript['if'] = function (block) {
    //var people = block.getFieldValue('is_vote');
    var statements_name = Blockly.JavaScript.statementToCode(block, 'is_vote');
    var code = `if isVote{
    vote++
    return
  }
  `;
    return code;
};

// ifelse
Blockly.Blocks['else'] = {
    init: function () {
        this.appendStatementInput('do').appendField('否则');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
    },
};

Blockly.JavaScript['else'] = function (block) {
    var code = `todo`;
    return code;
};



//四则运算
Blockly.Blocks['arithmetic'] = {
    init: function() {
        this.appendValueInput('VALUE').setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([['+', 'add'],['-','del'],['✖','multi'],['➗','div'],['=','equal']]),
                'op');
        this.appendValueInput('VALUE').setCheck(null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setInputsInline(true);
        this.setOutput(true);
        // this.setPreviousStatement(true, null);
        // this.setNextStatement(true, null);
        // this.setColour(20);
    },
};

Blockly.JavaScript['arithmetic'] = function (block) {
    var code = `//todo`;
    return code;
};

//大小判断
Blockly.Blocks['ip_compare'] = {
    init: function() {
        this.appendValueInput('VALUE').setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                    ['大于', 'more'],
                    ['小于','less'],
                    ['等于','equal'],
                    ['大于或等于','not_less'],
                    ['小于或等于','not_more'],
                    ['或','or'],
                    ["并且",'and'],
                ]),
                'op');
        this.appendValueInput('VALUE').setCheck(null);
        this.setColour(65);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setInputsInline(true);
        this.setOutput(true);
    },
};

Blockly.JavaScript['ip_compare'] = function (block) {
    var code = `//todo`;
    return code;
};

//大小判断
Blockly.Blocks['compare'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([['>', 'more'],['<','less'],['=','equal'],['>=','not_less'],['<=','not_more']]),
                'op');
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
    },
};

Blockly.JavaScript['compare'] = function (block) {
    var code = `//todo`;
    return code;
};

// 选择选项
Blockly.Blocks['choose'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("选择")
            .appendField(new Blockly.FieldDropdown([['1', '1'],['2','2'],['3','3'],['4','4'],['5','5']]),
                'vote_choice');
        this.setColour(160);
        this.setTooltip("");
        this.setHelpUrl("");

        // this.appendStatementInput('is_vote').appendField('如果');
        // this.appendDummyInput().appendField('计数器累加1');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
    },
};

Blockly.JavaScript['choose'] = function (block) {
    var code = `//todo`;
    return code;
};

// 阈值判断
Blockly.Blocks['threshold_judge'] = {
    init: function () {
        this.appendValueInput('event_1').setCheck('String').appendField('当');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([['或', 'or'],['且','and']]),
                'judge');
        this.appendValueInput('event_2').setCheck('String');
        this.appendStatementInput('contract').setCheck(null).appendField('');
        // this.setInputsInline(true);
        this.setColour(105);
        this.setTooltip('');

        this.setHelpUrl('');
    },
};

Blockly.JavaScript['threshold_judge'] = function (block) {
    var code = `//todo
  `;
    return code;
};
