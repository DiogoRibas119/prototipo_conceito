
pragma solidity ^0.5.15;


contract hashTest {
    string varHash;

    
    // Write Function
    function set(string memory _varHash) public {
        varHash = _varHash;
    }
    //Read Function
    function get() public view returns (string memory) {  
        return varHash;
    }
}
    









/*

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Prototype of concept

contract fileStorage {
    uint filecount = 0;
    mapping(uint => filedata) public files;

    struct filedata{
        uint _id;
        string _filename;
        string _hash;
    }

    function addfile(string memory _filename, string memory _hash) public {
        filecount ++;
        files[filecount] = filedata(filecount,_filename,_hash);
    }
}

*/