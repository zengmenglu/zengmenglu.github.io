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
            .appendField(new Blockly.FieldTextInput('小区名称'), 'vote_participant');
        this.appendDummyInput()
            .appendField("投票名称:")
            .appendField(new Blockly.FieldTextInput('...意见征询'), 'vote_title');
        this.appendDummyInput()
            .appendField('投票文件:')
            .appendField(new Blockly.FieldTextInput('文件oss地址'), 'vote_file');
        this.appendDummyInput()
            .appendField('投票阈值:')
            .appendField(new Blockly.FieldNumber(0.33), 'vote_threshold');
        this.appendStatementInput('vote_items')
            .appendField('表决项目：');
        this.appendStatementInput('vote_choice')
            .appendField('选项：');
        this.setInputsInline(false);
        this.setOutput(true)
        this.setColour(105);
    },
};

Blockly.JavaScript['vote_register'] = function (block) {
    var vote_participant = block.getFieldValue('vote_participant')
    var vote_title = block.getFieldValue('vote_title')
    var vote_file = block.getFieldValue('vote_file')
    var vote_threshold = block.getFieldValue('vote_threshold')
    var vote_items = Blockly.JavaScript.statementToCode(block, 'vote_items');
    var vote_choice = Blockly.JavaScript.statementToCode(block, 'vote_choice');

    var code = `
func NewVote() int {
    curVoteId, err := sdk.Instance.GetStateFromKey("Total_vote_num")
    if err != nil {
        curVoteId = 1
    }
    curVoteId++
    voteInfo := VoteInfo {
        curVoteId,
        "${vote_participant}",
        "${vote_title}",
        "${vote_file}",
        ${vote_threshold},
        "${vote_items}",
        "[]string{${vote_choice}},
    }
    voteInfoBytes, err := json.Marshal(&voteInfo)
    if err != nil {
        return -1
    }
    
    err1 := sdk.Instance.PutStateFromKey("vote_" + fmt.Sprintf("%d", curVoteId), voteInfoBytes)
    err2 := sdk.Instance.PutStateFromKey("Total_vote_num", curVoteId)
    if err1 != nil || err2 != nil{
        return -1
    }
    
    return curVoteId
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
            .appendField(', 表决项目:')
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
    var vote_id = block.getNumber('vote_item_id')
    var vote_items = block.getFieldValue('vote_items');
    var code = `VoteItem{"${vote_items}"},
  `;
    return code;
};

// 投票选项
Blockly.Blocks['vote_choice'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([['赞同', 'approve'],['反对','against'],['弃权','waiver'],['随大数','major']]),
                'choice'
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(105);
        this.setTooltip('');

        this.setHelpUrl('');
    },
};

Blockly.JavaScript['vote_choice'] = function (block) {
    var choices = block.getFieldValue('choice');
    var code = `"${choices}", `
    return code;
};
