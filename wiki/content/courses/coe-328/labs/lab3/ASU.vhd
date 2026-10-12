LIBRARY ieee;
USE ieee.std_logic_1164.all;
USE ieee.std_logic_unsigned.all;

ENTITY ASU IS
  PORT ( Cin            : IN  STD_LOGIC;                     
         X, Y           : IN  STD_LOGIC_VECTOR(3 DOWNTO 0);
         S              : OUT STD_LOGIC_VECTOR(3 DOWNTO 0);
         Cout, Overflow : OUT STD_LOGIC;
         neg            : OUT STD_LOGIC );
END ASU;

ARCHITECTURE Behavior OF ASU IS
  SIGNAL Yx       : STD_LOGIC_VECTOR(3 DOWNTO 0);
  SIGNAL Sum      : STD_LOGIC_VECTOR(4 DOWNTO 0);
  SIGNAL negative : STD_LOGIC;
BEGIN
  Yx  <= Y XOR (Cin & Cin & Cin & Cin);          
  Sum <= ('0' & X) + ('0' & Yx) + Cin;          
  Cout     <= Sum(4);
  Overflow <= Sum(4) XOR X(3) XOR Yx(3) XOR Sum(3);
  negative <= Cin AND NOT Sum(4);                
  neg      <= negative;
  S <= (NOT Sum(3 DOWNTO 0)) + 1 WHEN negative = '1' ELSE Sum(3 DOWNTO 0); 
END Behavior;