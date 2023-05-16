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
            .appendField("<IP托管>")
        this.appendDummyInput()
            .appendField("作品ID:")
            .appendField(new Blockly.FieldTextInput('123'), 'vote_participant');
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
