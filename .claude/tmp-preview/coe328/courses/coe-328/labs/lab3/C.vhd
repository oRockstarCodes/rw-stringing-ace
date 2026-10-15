LIBRARY ieee;
USE ieee.std_logic_1164.all;

ENTITY C IS
  PORT ( K : IN  STD_LOGIC_VECTOR(3 DOWNTO 0);
         L : OUT STD_LOGIC_VECTOR(3 DOWNTO 0) );
END C;

ARCHITECTURE Logic OF C IS
BEGIN
  L(3) <= (K(3) AND K(2)) OR
          (K(3) AND K(1)) OR
          (K(3) AND K(0));

  L(2) <= (NOT K(3) AND NOT K(2) AND NOT K(1)) OR
          (K(2) AND K(0)) OR
          (K(2) AND K(1)) OR
          (K(3) AND K(1)) OR
          (K(3) AND K(2));

  L(1) <= (K(2) AND NOT K(0)) OR
          (K(3) AND NOT K(0)) OR
          (K(3) AND K(2)) OR
          (K(3) AND K(1));

  L(0) <= (NOT K(3) AND NOT K(1)) OR
          (NOT K(2) AND NOT K(1)) OR
          (NOT K(3) AND NOT K(2) AND K(0));
END Logic;