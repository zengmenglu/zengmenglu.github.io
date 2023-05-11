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


Blockly.Blocks['timer_init'] = {
    init: function () {
        this.appendDummyInput().appendField('设定时钟');
        this.appendStatementInput('info').setCheck(null).appendField('');
        this.setInputsInline(false);
        // this.setOutput(true, null);
        // this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Go interface');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['timer_init'] = function (block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'ints');
    // TODO: Assemble JavaScript into code variable.
    var code = `map[string]interface{}{
    ${statements_name}
}`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['time'] = {
    init: function () {
        this.setInputsInline(false);
        this.appendDummyInput()
            .appendField('')
            .appendField(new Blockly.FieldNumber(2023), 'year')
            .appendField('年')
            .appendField(new Blockly.FieldTextInput('5'), 'month')
            .appendField('月')
            .appendField(new Blockly.FieldTextInput('6'), 'day')
            .appendField('日')
            .appendField(new Blockly.FieldTextInput('12'), 'hour')
            .appendField('时')
            .appendField(new Blockly.FieldTextInput('00'), 'minute')
            .appendField('分')
            .appendField(new Blockly.FieldTextInput('00'), 'second')
            .appendField('秒');
        this.setOutput(true, null);
        // this.setNextStatement(true, null);
        this.setColour(100);
        this.setTooltip('Go interface');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['time'] = function (block) {
    var y = block.getFieldValue('year');
    var m = block.getFieldValue('month');
    var d = block.getFieldValue('day');
    var h = block.getFieldValue('hour');
    var min = block.getFieldValue('minute');
    var s = block.getFieldValue('second');
    var code = `${y}-${m}-${d} ${h}:${min}:${s}"`;
    return code;
};

Blockly.Blocks['time_event'] = {
    init: function () {
        this.appendValueInput('event_id')
            .setCheck(null)
            .appendField('定时器ID：');
        this.appendValueInput('timer').setCheck(null).appendField('截止时间：');
        this.appendDummyInput().appendField("设定者：").appendField(
            new Blockly.FieldDropdown([['银联', 'bankco'],['CA','ca'],['业委','committee']]),
            'owner'
        );
        // this.appendValueInput('owner').setCheck(null).appendField('设定者：');
        this.setInputsInline(false);
        // this.setInputsInline(true);
        // this.setOutput(true, null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip('Go interface');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['time_event'] = function (block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'ints');
    // TODO: Assemble JavaScript into code variable.
    var code = `map[string]interface{}{
    ${statements_name}
}`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// CA时钟服务
Blockly.Blocks['CA_time_event'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('<CA时钟服务>')
        this.appendValueInput('event_id')
            .setCheck(null)
            .appendField('定时器ID：');
        this.appendValueInput('timer').setCheck(null).appendField('截止时间：');
        // this.appendValueInput('owner').setCheck(null).appendField('设定者：');
        this.setInputsInline(false);
        // this.setInputsInline(true);
        // this.setOutput(true, null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip('Go interface');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['CA_time_event'] = function (block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'ints');
    // TODO: Assemble JavaScript into code variable.
    var code = `map[string]interface{}{
    ${statements_name}
}`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};
