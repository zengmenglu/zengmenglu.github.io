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

// 定时器定时触发
Blockly.Blocks['trigger'] = {
    init: function () {
        this.appendValueInput('event_1').setCheck('String').appendField('当');
        // this.appendDummyInput()
        //     .appendField(new Blockly.FieldDropdown([['或', 'or'],['且','and']]),
        //         'judge');
        // this.appendValueInput('event_2').setCheck('String');
        this.appendStatementInput('contract').setCheck(null).appendField('');
        // this.setInputsInline(true);
        this.setColour(105);
        this.setTooltip('');

        this.setHelpUrl('');
    },
};

Blockly.JavaScript['trigger'] = function (block) {
    var code = `//todo
  `;
    return code;
};

// 定时器定时触发
Blockly.Blocks['timer_trigger'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('当定时器')
            .appendField(new Blockly.FieldTextInput('event_1'), 'item')
            .appendField('发生时');
        // this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['timer_trigger'] = function (block) {
    var code = `//todo
  `;
    return code;
};

// 触发合约
Blockly.Blocks['invoke'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([['业委会主任', 'committer']]),
                'people'
            ).appendField('发起计票时');
        this.setOutput(true);
        this.setColour(345);
    },
};

Blockly.JavaScript['invoke'] = function (block) {
    var people = block.getFieldValue('people');
    var statements_name = Blockly.JavaScript.statementToCode(block, 'contract');
    var code = `if ${people}() {
  ${statements_name}()
    return
  }
  `;
    return code;
};

// 合约执行动作列表
Blockly.Blocks['contract_handle_list'] = {
    init: function () {
        this.appendStatementInput('methods')
            .setCheck(null)
            .appendField('合约执行动作列表');
        this.setInputsInline(false);

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Go interface');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['contract_handle_list'] = function (block) {
    var people = block.getFieldValue('methods');
    var statements_name = Blockly.JavaScript.statementToCode(block, 'methods');
    var code = `
func NewVoteCount() *VoteCount {
	return &voteCount{}
}

func (voteCount *VoteCount) InitContract() protogo.Response {
	return sdk.Success([]byte("Init contract success"))
}

func (voteCount *VoteCount) UpgradeContract() protogo.Response {
	return sdk.Success([]byte("Upgrade contract success"))
}

func (voteCount *VoteCount) InvokeContract(method string) protogo.Response {
	${statements_name}\n
}
`;
    return code;
};

// 调用合约
Blockly.Blocks['contract_name'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('<调用合约>');
        this.appendDummyInput()
            .appendField("链：")
            .appendField(
                new Blockly.FieldDropdown([
                    ['投票链', 'vote_chain'],
                ]),
                'chain_name'
            )
            .appendField(", 合约：")
            .appendField(
                new Blockly.FieldDropdown([
                    ['计票合约', 'vote_count_contract'],
                    ['投票合约', 'vote_contract'],
                ]),
                'contract_name'
            );
        this.setInputsInline(false);
        // this.setInputsInline(true);
        // this.setOutput(true, null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Go interface');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['contract_name'] = function (block) {
    var name = block.getFieldValue('contractName');
    return name;
};

// 公证处计票模块

// 注册投票信息
Blockly.Blocks['cal_ticket'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<公证处计票模块>")
        this.appendDummyInput()
            .appendField("投票ID:")
            .appendField(new Blockly.FieldTextInput('name'), 'vote_participant');
        this.appendDummyInput()
            .appendField("邮箱地址:")
            .appendField(new Blockly.FieldTextInput('...@sheca.com'), 'vote_title');
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setOutput(true)
        this.setColour(160);
    },
};

Blockly.JavaScript['cal_ticket'] = function (block) {
    var code = `//todo`;
    return code;
};
