package coe318.lab5;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author rocky
 */
import java.util.Scanner;

public class SimpleUI implements UserInterface {

    private BlackjackGame game;
    private Scanner user = new Scanner(System.in);

    @Override
    public void setGame(BlackjackGame game) {
        this.game = game;
    }

    /**
     * Print a heading followed by one card per line. CardPile.toString()
     * already ends every card with a newline, so print (not println) it.
     */
    private void show(String heading, CardPile pile) {
        System.out.println(heading);
        System.out.print(pile);
    }

    @Override
    public void display() {
        show("House holds:", game.getHouseCards());
        System.out.println();
        show("You hold:", game.getYourCards());
        System.out.println();
    }

    @Override
    public boolean hitMe() {
        System.out.print("Do you want another card (y/n)? ");
        String answer = user.nextLine();
        return answer.trim().equalsIgnoreCase("y");
        //FIX THIS
    }

    @Override
    public void gameOver() {
        int houseScore = game.score(game.getHouseCards());
        int yourScore = game.score(game.getYourCards());

        System.out.println("Game over");
        System.out.println();
        show("House holds:", game.getHouseCards());
        System.out.println();
        show("You hold:", game.getYourCards());
        System.out.println();
        System.out.println("Your score: " + yourScore + ", House score: " + houseScore);

        if (yourScore > 21) {
            System.out.println("You bust. House wins.");
        } else if (houseScore > 21) {
            System.out.println("House busts. You win!");
        } else if (yourScore > houseScore) {
            System.out.println("You win!");
        } else if (houseScore > yourScore) {
            System.out.println("House wins.");
        } else {
            System.out.println("Tie. House wins.");
        }
    }

}
