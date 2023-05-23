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
