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

// 转账
Blockly.Blocks['transfer'] = {
    init: function() {
        this.appendDummyInput().appendField('<转账模块>')
        this.appendValueInput('VALUE').setCheck(null).appendField("转账方");
        this.appendValueInput('VALUE').setCheck(null).appendField("收账方");
        this.appendValueInput('VALUE').setCheck(null).appendField("转账金额");
        this.setColour(65);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // this.setOutput(true);
    },
};

Blockly.JavaScript['transfer'] = function (block) {
    var code = `//todo`;
    return code;
};
