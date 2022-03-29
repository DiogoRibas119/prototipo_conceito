
/*
pragma solidity ^0.8.13;

contract hashTest {

    uint counter = 1;
    string[] files;

    // Write Function
    function set(string memory varHash) public {
        files[counter] = varHash;
        counter++;
    }
    //Read Function
    function get(uint _counter) public view returns (string memory) {  
        
        return files[_counter];
    }
    function getCounter() public view returns (uint) {
        return counter;
    }
}
    
*/










// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Prototype of concept

contract fileStorage {
    int filecount = 0;
    mapping(int => filedata) public files;

    struct filedata{
        int _id;
        string _hash;
    }

    function set( string memory _hash) public {
        filecount++;
        files[filecount] = filedata(filecount,_hash);
    }

    function get(int _temp) public view returns (string memory) {

        return files[_temp]._hash;
    }

    function getCounter() public view returns (int){
        return filecount;
    }
}

