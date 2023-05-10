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

// 注册投票信息
Blockly.Blocks['vote_register'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('注册投票信息');
        this.appendDummyInput()
            .appendField("参与者:")
            .appendField(new Blockly.FieldTextInput('小区'), 'vote_participant');
        this.appendDummyInput()
            .appendField("投票名称:")
            .appendField(new Blockly.FieldTextInput('意见征询'), 'vote_title');
        this.appendDummyInput()
            .appendField('投票文件:')
            .appendField(new Blockly.FieldTextInput('文件oss地址'), 'vote_file');
        this.appendDummyInput()
            .appendField('投票阈值:')
            .appendField(new Blockly.FieldNumber(0.33), 'vote_threshold');
        this.appendStatementInput('vote_items')
            .appendField('投票项：');
        this.setInputsInline(false);
        this.setColour(105);
    },
};


Blockly.JavaScript['vote_register'] = function (block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'vote_info');
    // TODO: Assemble JavaScript into code variable.

    var code = `
func main() {
  
${statements_name}
  //todo
}
`;
    return code;
};

// 投票项
Blockly.Blocks['vote_item'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('序号:')
            .appendField(new Blockly.FieldNumber(1), 'vote_item_id')
            .appendField(', 投票内容:')
            .appendField(new Blockly.FieldTextInput('contents'), 'vote_items');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(105);
        this.setTooltip('');

        this.setHelpUrl('');
    },
};

Blockly.JavaScript['vote_item'] = function (block) {
    var vote_items = block.getFieldValue('item');
    var code = `"${vote_items}",
  `;
    return code;
};
