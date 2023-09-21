// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Upload1235656 {
    struct Access {
        address user;
        bool access;
    }

    struct Feedback {
        address user;
        string record;
        string feedback;
        string userName; // Add the user's name here
    }

    struct UserData {
        string name;
        string[] records;
    }

    mapping(address => UserData) private users;
    mapping(address => mapping(address => bool)) private ownership;
    mapping(address => Access[]) private accessList;
    mapping(address => mapping(address => bool)) private previousData;
    Feedback[] private feedbackList;

    event FeedbackProvided(address user, string record, string feedback, string userName);

    function add(string memory url) external {
        UserData storage user = users[msg.sender];
        user.records.push(url);
    }

    function allow(address user) external {
        ownership[msg.sender][user] = true;
        if (previousData[msg.sender][user]) {
            for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true;
        }
    }

    function display(address userAddress) external view returns (string[] memory) {
        UserData storage user = users[userAddress];
        return user.records;
    }

    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }

    function provideFeedback(string memory record, string memory feedback, string memory userName) public {
        feedbackList.push(Feedback(msg.sender, record, feedback, userName));
        emit FeedbackProvided(msg.sender, record, feedback, userName);
    }

    function getFeedbackCount() public view returns (uint256) {
        return feedbackList.length;
    }

    function getFeedback(uint256 index) public view returns (address, string memory, string memory, string memory) {
        require(index < feedbackList.length, "Invalid feedback index");
        Feedback memory feedback = feedbackList[index];
        return (feedback.user, feedback.record, feedback.feedback, feedback.userName);
    }

    function setName(string memory name) external {
        UserData storage user = users[msg.sender];
        user.name = name;
    }

    function getName(address userAddress) external view returns (string memory) {
        return users[userAddress].name;
    }
}
