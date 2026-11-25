-- 3x8 decoder with enable: y(i) = '1' only when En = '1' and w = i.
library ieee;
use ieee.std_logic_1164.all;

entity dec3to8 is
  port ( w  : in  std_logic_vector(2 downto 0);
         En : in  std_logic;
         y  : out std_logic_vector(7 downto 0));
end dec3to8;

architecture behavior of dec3to8 is
begin
  process (w, En)
  begin
    y <= "00000000";
    if En = '1' then
      case w is
        when "000" => y <= "00000001";
        when "001" => y <= "00000010";
        when "010" => y <= "00000100";
        when "011" => y <= "00001000";
        when "100" => y <= "00010000";
        when "101" => y <= "00100000";
        when "110" => y <= "01000000";
        when others => y <= "10000000";
      end case;
    end if;
  end process;
end behavior;

