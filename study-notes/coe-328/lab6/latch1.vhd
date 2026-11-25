-- Part II: 8-bit register (Figure 2 template). Despite the name it is
-- edge-triggered: Q copies A on each rising clock edge.
-- Resetn is ACTIVE-LOW: Q is cleared while Resetn = '0'.
LIBRARY ieee;
USE ieee.std_logic_1164.all;

ENTITY latch1 IS
  PORT ( A             : IN  STD_LOGIC_VECTOR(7 DOWNTO 0);  -- 8-bit input
         Resetn, Clock : IN  STD_LOGIC;
         Q             : OUT STD_LOGIC_VECTOR(7 DOWNTO 0)); -- 8-bit output
END latch1;

ARCHITECTURE Behavior OF latch1 IS
BEGIN
  PROCESS (Resetn, Clock)
  BEGIN
    IF Resetn = '0' THEN
      Q <= "00000000";
    ELSIF Clock'EVENT AND Clock = '1' THEN
      Q <= A;
    END IF;
  END PROCESS;
END Behavior;
