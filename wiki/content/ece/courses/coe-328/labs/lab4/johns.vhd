LIBRARY ieee;
USE ieee.std_logic_1164.all;

ENTITY johns IS
    PORT ( Clrn, E, Clkn : IN  STD_LOGIC;  -- Clrn is your reset button
           STUDENT_ID    : OUT STD_LOGIC_VECTOR(3 DOWNTO 0);
           Q             : OUT STD_LOGIC_VECTOR(0 TO 2) );
END johns;

ARCHITECTURE Behavior OF johns IS
    SIGNAL Qreg : STD_LOGIC_VECTOR(0 TO 2);
BEGIN
    PROCESS (Clrn, Clkn)
    BEGIN
        IF Clrn = '0' THEN
            Qreg <= "000";
        ELSIF (Clkn'EVENT AND Clkn = '0') THEN
            IF E = '1' THEN
                Qreg(0) <= NOT Qreg(2);
                Qreg(1) <= Qreg(0);
                Qreg(2) <= Qreg(1);
            ELSE
                Qreg <= Qreg;
            END IF;
        END IF;
    END PROCESS;

    -- digits shown: 3 5 6 4 3 9  (last six digits of 501356439)
    PROCESS (Qreg)
    BEGIN
        CASE Qreg IS
            WHEN "000" => STUDENT_ID <= "0011";  -- d1 = 3
            WHEN "100" => STUDENT_ID <= "0101";  -- d2 = 5
            WHEN "110" => STUDENT_ID <= "0110";  -- d3 = 6
            WHEN "111" => STUDENT_ID <= "0100";  -- d4 = 4
            WHEN "011" => STUDENT_ID <= "0011";  -- d5 = 3
            WHEN "001" => STUDENT_ID <= "1001";  -- d6 = 9
            WHEN OTHERS => STUDENT_ID <= "1110"; -- invalid state, shows E
        END CASE;
    END PROCESS;

    Q <= Qreg;
END Behavior;