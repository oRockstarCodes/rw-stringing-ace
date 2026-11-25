-- Part IV: ALU core (Figure 4 template, filled in).
-- Changes from the template:
--   * process(Clk, OP) -> process(Clock): the port is called Clock, and a
--     clocked process only needs the clock in its sensitivity list.
--   * dropped STD_LOGIC_UNSIGNED: NUMERIC_STD already gives + and - on unsigned,
--     and using both libraries can make operators ambiguous.
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity ALU is
  port ( Clock      : in  std_logic;              -- input clock signal
         A, B       : in  unsigned(7 downto 0);   -- 8-bit inputs from the registers
         student_id : in  unsigned(3 downto 0);   -- from FSM (unused until Problem 3)
         OP         : in  unsigned(15 downto 0);  -- one-hot selector from decoder
         Neg        : out std_logic;              -- '1' when subtraction result is negative
         R1         : out unsigned(3 downto 0);   -- lower 4 bits of Result
         R2         : out unsigned(3 downto 0));  -- upper 4 bits of Result
end ALU;

architecture calculation of ALU is
  signal Reg1, Reg2, Result : unsigned(7 downto 0) := (others => '0');
  signal Reg4 : unsigned(0 to 7);                 -- spare, kept from template
begin
  Reg1 <= A;
  Reg2 <= B;

  process (Clock)
  begin
    if rising_edge(Clock) then
      Neg <= '0';                                 -- only subtraction sets it
      case OP is
        when "0000000000000001" =>                -- 1: sum(A, B)
          Result <= Reg1 + Reg2;
        when "0000000000000010" =>                -- 2: diff(A, B)
          if Reg1 < Reg2 then                     -- negative: show magnitude, light minus sign
            Result <= Reg2 - Reg1;
            Neg    <= '1';
          else
            Result <= Reg1 - Reg2;
          end if;
        when "0000000000000100" =>                -- 3: NOT A
          Result <= not Reg1;
        when "0000000000001000" =>                -- 4: A NAND B
          Result <= Reg1 nand Reg2;
        when "0000000000010000" =>                -- 5: A NOR B
          Result <= Reg1 nor Reg2;
        when "0000000000100000" =>                -- 6: A AND B
          Result <= Reg1 and Reg2;
        when "0000000001000000" =>                -- 7: A XOR B
          Result <= Reg1 xor Reg2;
        when "0000000010000000" =>                -- 8: A OR B
          Result <= Reg1 or Reg2;
        when "0000000100000000" =>                -- 9: A XNOR B
          Result <= Reg1 xnor Reg2;
        when others =>                            -- don't care, do nothing
          null;
      end case;
    end if;
  end process;

  R1 <= Result(3 downto 0);   -- each 7-seg only takes 4 bits,
  R2 <= Result(7 downto 4);   -- so split the 8-bit Result in two
end calculation;
