// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Upload {
    struct Access {
        address user;
        bool access;
    }

    struct Feedback {
        address user;
        string record;
        string feedback;
        string userName;
    }

    struct UserData {
        string name;
        string[] records;
        string pythonResult;
        string decision_tree;
        string random_forest;
        string naive_bayes;
    }

    mapping(address => UserData) public users;
    mapping(address => Access[]) public accessList;
    Feedback[] public feedbackList;

    address public owner;

    event FeedbackProvided(address indexed user, string record, string feedback, string userName);
    event PythonResultStored(address indexed user, string result);
    event DiseasePredictionsStored(
        address indexed user,
        string decision_tree,
        string random_forest,
        string naive_bayes
    );

    constructor() {
        owner = msg.sender;
    }

    function add(string memory url) external {
        UserData storage user = users[msg.sender];
        user.records.push(url);
    }

    function allow(address user) external {
        accessList[msg.sender].push(Access(user, true));
    }

    function revokeAccess(address user) external {
        for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    function display(address userAddress) external view returns (string[] memory) {
         UserData storage user = users[userAddress];
        return user.records;
    }

    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }

    function provideFeedback(string memory record, string memory feedback, string memory userName) external {
        feedbackList.push(Feedback(msg.sender, record, feedback, userName));
        emit FeedbackProvided(msg.sender, record, feedback, userName);
    }

    function getFeedbackCount() external view returns (uint256) {
        return feedbackList.length;
    }

    function getFeedback(uint256 index) external view returns (address, string memory, string memory, string memory) {
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

    function setPythonResult(string memory result) external {
        UserData storage user = users[msg.sender];
        user.pythonResult = result;
        emit PythonResultStored(msg.sender, result);
    }

    function setDiseasePredictions(
        string memory decision_tree,
        string memory random_forest,
        string memory naive_bayes
    ) external {
        UserData storage user = users[msg.sender];
        user.decision_tree = decision_tree;
        user.random_forest = random_forest;
        user.naive_bayes = naive_bayes;
        emit DiseasePredictionsStored(msg.sender, decision_tree, random_forest, naive_bayes);
    }

// Add a function to fetch disease predictions
function getDiseasePredictions(address userAddress) external view returns (string memory, string memory, string memory) {
    UserData storage user = users[userAddress];
    return (user.decision_tree, user.random_forest, user.naive_bayes);
}
}