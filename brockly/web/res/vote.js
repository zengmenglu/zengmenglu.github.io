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

//注册投票总体块
Blockly.Blocks['vote_block'] = {
    init: function () {
        this.appendStatementInput("vote")
            .appendField('注册投票');
        this.setInputsInline(false);
        this.setColour(105);
    },
};

Blockly.JavaScript['vote_block'] = function (block) {
    var code = `
// todo
`;
    return code;
};

// 注册投票信息
Blockly.Blocks['vote_register'] = {
    init: function () {
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
        this.appendDummyInput()
            .appendField('投票选项个数：')
            .appendField(new Blockly.FieldDropdown([['1', '1'],['2','2'],['3','3'],['4','4'],['5','5']]),
            'vote_choice');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setOutput(true)
        this.setColour(160);
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
        this.setColour(65);
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

// 投票oss文件上传
Blockly.Blocks["upload_file"] = {
    init: function () {
        this.appendStatementInput("vote_items").setCheck(null).appendField("上传投票文件");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(105);
        this.setTooltip('');

        this.setHelpUrl('');
    },
};

Blockly.JavaScript['upload_file'] = function (block) {
    var vote_items = Blockly.JavaScript.statementToCode(block, 'vote_items');
    var code = `var voteFile = []string {
  ${vote_items}
}
  `;
    return code;
};

// 投票列表
Blockly.Blocks["vote_list"] = {
    init: function () {
        this.appendStatementInput("vote_items").setCheck(null).appendField("投票项：");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(105);
        this.setTooltip('');

        this.setHelpUrl('');
    },
};

Blockly.JavaScript['vote_list'] = function (block) {
    var vote_items = Blockly.JavaScript.statementToCode(block, 'vote_items');
    var code = `var voteList = []string {
  ${vote_items}
}
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

Blockly.Blocks['vote_threshold'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('设置投票编号为')
            .appendField(new Blockly.FieldTextInput('vote_1'), 'vote_id')
            .appendField('的阈值为')
            .appendField(new Blockly.FieldTextInput('0.33'), 'threthold');

        // this.setInputsInline(false);
        this.setOutput(true, null);
        // this.setPreviousStatement(true, null);
        // this.setNextStatement(true, null);
        this.setColour(560);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['vote_threshold'] = function (block) {
    var code = `set voting threshold()`;
    return code;
};


Blockly.Blocks['cal_vote_result'] = {
    init: function () {
        this.appendDummyInput('').appendField('从链上获取投票数据并统计');
        this.appendValueInput('vote_rate')
            // .appendField("设置投票通过阈值：")
            .appendField('设置投票通过阈值:');
        // this.setInputsInline(false);
        // this.setOutput(true, null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['cal_vote_result'] = function (block) {
    var code = `calculate the voting results()`;
    return code;
};

Blockly.Blocks['upload'] = {
    init: function () {
        this.appendDummyInput('').appendField('生成投票结果并上链');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(100);
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['upload'] = function (block) {
    var code = `upload()`;
    return code;
};