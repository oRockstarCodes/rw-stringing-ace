/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author rocky
 */
package coe318.lab4;

public class Account {
    private String name;
    private int num;
    private double bal;
    
    public Account(String name, int number, double initialBalance){
        this.name = name;
        this.num = number;
        this.bal = initialBalance;
    }
    public String getName() {
        return this.name;
    }

    public double getBalance() {
        return this.bal;
    }

    public int getNumber() {
        return this.num;
    }

    public boolean deposit(double amount) {
        if(amount<=0){
           return false; 
        }else{
            this.bal += amount;
            return true;
        }
    }

    public boolean withdraw(double amount) {
        if(amount <=0){
            return false;
        }else if (amount > this.bal){
            return false;
        }else{
            this.bal -= amount;
            return true;
        }
    }

    @Override
    public String toString() {//DO NOT MODIFY
        return "(" + getName() + ", " + getNumber() + ", "+ String.format("$%.2f", getBalance()) + ")";
    }
}
