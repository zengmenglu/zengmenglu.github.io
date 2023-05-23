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

// 托管作品
Blockly.Blocks['ip_init'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP托管>");
        this.appendDummyInput()
            .appendField("作品ID:")
            .appendField(new Blockly.FieldTextInput('123'), 'vote_participant');
        this.appendDummyInput()
            .appendField("著作权人:")
            .appendField(new Blockly.FieldTextInput('AA'), 'vote_participant');
        this.appendDummyInput()
            .appendField("代理机构：")
            .appendField(
                new Blockly.FieldDropdown([
                    ['知交所', 'IPXI'],
                    ['技交所','TE'],
                    ['美术版权协会','copyright']]),
                'institute'
            );
        this.appendValueInput('use').setCheck(null).appendField('授权起始时间：');
        this.appendValueInput('use').setCheck(null).appendField('授权终止时间：');
        this.appendDummyInput()
            .appendField("授权许可性质：")
            .appendField(
                new Blockly.FieldDropdown([
                    ['独家授权', 'IPXI'],
                    ['排他性授权','TE'],
                    ['非独家授权','copyright']]),
                'trustee'
            );
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
        this.setOutput(true);
        // this.setPreviousStatement(true, null);
        // this.setNextStatement(true, null);
        this.setColour(290);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['ip_trustee'] = function (block) {
    var code = `//todo`;
    return code;
};

// ip使用次数统计
Blockly.Blocks['ip_use_counter'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP使用统计模块>");
        this.appendValueInput('use').setCheck(null).appendField('托管ID：');
        // this.appendValueInput("vote_id:").appendField("统计起始时间: ");
        // this.appendValueInput("email").appendField('统计终止时间:');
        this.setInputsInline(false);
        // this.setPreviousStatement(true, null);
        // this.setNextStatement(true, null);
        this.setOutput(true)
        this.setColour(160);
    },
};

Blockly.JavaScript['ip_use_counter'] = function (block) {
    var code = `//todo`;
    return code;
};

// 获取ip授权ID
Blockly.Blocks['ip_get_use_cnt'] = {
    init: function () {
        this.appendValueInput('NAME')
            .appendField("接收IP使用次数并标记为")
            .appendField(new Blockly.FieldTextInput('auth_id_1'), 'key');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip('Go interface field');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['ip_get_use_cnt'] = function (block) {
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
        this.appendValueInput("vote_id:")
            .appendField("IP使用次数: ");
        this.appendStatementInput('do');
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



//大小判断
Blockly.Blocks['ip_money_cal'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<IP结算模块>");
        this.appendValueInput("vote_id:")
            .appendField("IP使用次数: ");
        this.appendStatementInput('do');
        this.setInputsInline(false);
        // this.setPreviousStatement(true, null);
        // this.setNextStatement(true, null);
        this.setOutput(true)
        this.setColour(160);
    },
};

Blockly.JavaScript['ip_money_cal'] = function (block) {
    var code = `//todo`;
    return code;
};

// 获取ip托管ID
Blockly.Blocks['ip_money_cal_res'] = {
    init: function () {
        this.appendValueInput('NAME')
            .appendField("接收IP使用费并并标记为")
            .appendField(new Blockly.FieldTextInput('ip_use_fee'), 'key');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Go interface field');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['ip_money_cal_res'] = function (block) {
    var code = `//todo`;
    return code;
};
