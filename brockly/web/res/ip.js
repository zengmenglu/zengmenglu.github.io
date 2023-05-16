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

// 获取ip托管ID
Blockly.Blocks['ip_host_id'] = {
    init: function () {
            this.appendValueInput('NAME')
                .appendField("接收托管ID并标记为")
                .appendField(new Blockly.FieldTextInput('trustee_id_1'), 'key');
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Go interface field');
            this.setHelpUrl('');
    },
};

Blockly.JavaScript['ip_host_id'] = function (block) {
    var code = `//todo`;
    return code;
};

// 获取ip授权ID
Blockly.Blocks['ip_auth_id'] = {
    init: function () {
        this.appendValueInput('NAME')
            .appendField("接收授权ID并标记为")
            .appendField(new Blockly.FieldTextInput('auth_id_1'), 'key');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Go interface field');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['ip_auth_id'] = function (block) {
    var code = `//todo`;
    return code;
};

// 托管作品
Blockly.Blocks['ip_init'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP托管>");
        this.appendDummyInput()
            .appendField("作品ID:")
            .appendField(new Blockly.FieldTextInput('123'), 'vote_participant');
        this.appendDummyInput()
            .appendField("持有人:")
            .appendField(new Blockly.FieldTextInput('AA'), 'vote_participant');
        this.appendStatementInput('institute')
            .appendField('托管机构:');
        this.setInputsInline(false);
        this.setOutput(true)
        this.setColour(160);
    },
};

Blockly.JavaScript['ip_init'] = function (block) {
    var code = `//todo`;
    return code;
};

// 托管机构
Blockly.Blocks['ip_trustee'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([
                    ['知交所', 'IPXI'],
                    ['技交所','TE'],
                    ['美术版权协会','copyright']]),
                'trustee'
            );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['ip_trustee'] = function (block) {
    var code = `//todo`;
    return code;
};

// 授权
Blockly.Blocks['ip_auth'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP授权>");
        this.appendValueInput('use').setCheck(null).appendField('托管ID：');
        this.appendStatementInput('institute')
            .appendField("授权机构:");
        this.appendValueInput('use').setCheck(null).appendField('IP使用方：');
        this.appendValueInput('use').setCheck(null).appendField('授权起始时间：');
        this.appendValueInput('use').setCheck(null).appendField('授权终止时间：');
        this.setInputsInline(false);
        this.setOutput(true);
        // this.setPreviousStatement(true,null);
        // this.setNextStatement(true, null);
        this.setColour(160);
    },
};

Blockly.JavaScript['ip_auth'] = function (block) {
    var code = `//todo`;
    return code;
};

// ip使用次数统计
Blockly.Blocks['ip_use_counter'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP使用统计模块>");
        this.appendDummyInput()
            .appendField("循环:");
        this.appendValueInput('use').setCheck(null).appendField('每次使用IP：');
        this.appendStatementInput("do")
        // this.appendValueInput("vote_id:")
        //     .appendField("授权ID: ");
        // this.appendValueInput("email")
        //     .appendField('设置邮箱地址:');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setOutput(true)
        this.setColour(160);
    },
};

Blockly.JavaScript['ip_call'] = function (block) {
    var code = `//todo`;
    return code;
};

// ip计算
Blockly.Blocks['ip_cal'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP分润模块>");
        this.appendValueInput("vote_id:")
            .appendField("授权ID: ");
        this.appendValueInput("email")
            .appendField('设置邮箱地址:');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setOutput(true)
        this.setColour(160);
    },
};

Blockly.JavaScript['ip_call'] = function (block) {
    var code = `//todo`;
    return code;
};
