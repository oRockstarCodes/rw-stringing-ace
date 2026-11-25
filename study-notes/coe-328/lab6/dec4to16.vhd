-- 4x16 decoder: S3 picks which 3x8 decoder is enabled.
--   S3 = 0 -> lower decoder drives OP(7..0)
--   S3 = 1 -> upper decoder drives OP(15..8)
library ieee;
use ieee.std_logic_1164.all;

entity dec4to16 is
  port ( w  : in  std_logic_vector(3 downto 0);   -- current_state from FSM
         En : in  std_logic;                      -- tie to VCC
         y  : out std_logic_vector(15 downto 0)); -- OP to the ALU
end dec4to16;

architecture structure of dec4to16 is
  component dec3to8
    port ( w  : in  std_logic_vector(2 downto 0);
           En : in  std_logic;
           y  : out std_logic_vector(7 downto 0));
  end component;
  signal enLow, enHigh : std_logic;
begin
  enLow  <= En and not w(3);   -- top AND gate in Figure 3
  enHigh <= En and w(3);       -- bottom AND gate in Figure 3
  lower : dec3to8 port map (w(2 downto 0), enLow,  y(7 downto 0));
  upper : dec3to8 port map (w(2 downto 0), enHigh, y(15 downto 8));
end structure;
